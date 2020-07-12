class CalcController {
    constructor(){//construtor
        this._lastOperator='';
        this._lastNumber= '';
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this._audioOnOff=false;
        this._audio = new Audio('click.mp3');
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    copyToClipboard(){//copiar ctrl + c
        let input = document.createElement('input');//criou o elemento
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    pasteFromClipboard(){//colar ctrl + v
        document.addEventListener('paste', e=>{
           let text = e.clipboardData.getData('Text');
           this.displayCalc = parseFloat(text);
           console.log(text);
        });
    }

    initialize(){//inializar a calculadora
        this.setDisplayDateTime();

        let interval = setInterval(()=>{
            this.setDisplayDateTime();
        },1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{//adiconar dupli click
                this.toggleAudio();
            });
        });
        /*setTimeout(()=>{
            clearInterval(interval);
        });//stop the interval*/
    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff; //inverte v --> f and f --> v
    }

    playAudio(){
        if (this._audioOnOff) {//quando tiver ligado
            this._audio.currentTime = 0;
            this._audio.play();//executar o audio
        }
    }

    initKeyboard(){//key down aperta o teclas - key press pressiona tecla - key up quando solta a tecla
        document.addEventListener('keyup', e=>{
            this.playAudio();
            console.log(e.key);
            switch (e.key) {
                case "Escape":
                    this.clearAll();
                    break;
                case "Backspace":
                    this.cancelEntry();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key);
                case "=":
                case "Enter":
                    this.calc();
                    break;
                case ".":
                case ",":
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();//se apertou o ctrl c
                    break;
            }
        });
    }

    addEventListenerAll(element, events, fn){// por evento do click do mouse a passar mouse por cima
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    }
    
    clearAll(){//limpar a calculadora
        this._operation = [];
        this._lastOperator = '';
        this._lastNumber = '';
        this.setLastNumberToDisplay();
    }

    cancelEntry(){//cancela ultima operacao
        this._operation.pop(); //elemina o ultimo elemento do push
        this.setLastNumberToDisplay();
    }

    getLastOperation(){//ultima operacao
       return this._operation[this._operation.length-1];
    }

    setLastOperation(value){//colocar na mesma posicao do array
        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){
        return (['+','-','*', '/', '%'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);
        if (this._operation.length>3) {
            this.calc();
        } 
    }

    getResult(){
        try {
            return eval(this._operation.join("")); // join pegar um string tira as virgulas e excuta o que tem dentro    
        } catch (e) {
            setTimeout(()=>{
                this.setError();
            },1);//esperar 1 milesegundo para executar a acao
        }
        
    }

    calc(){
        let last='';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem,this._lastOperator,this._lastNumber];
            
        }else if (this._operation.length>3) {//caso tenha o ultimo elemento for operador
            last = this._operation.pop();//tira ultimo elemento do array 
            console.log("getresult",this.getResult());
            this._lastNumber = this.getResult();
        }else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }
        
        console.log("lastOperator",this._lastOperator);
        console.log("lastNumber",this._lastNumber);

        let result = this.getResult();
        if (last == "%") {//se for porcento
            result /= 100;
            this._operation = [result];//só resultado sem operador
        } else {
            if (last) { // caso last não for vazio
                this._operation = [result,last];//novo array 
            } else {
                this._operation = [result];//novo array     
            }
        }
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        let lastItem;
        for (let index = (this._operation.length-1); index >= 0; index--) {//decrementar até final do array
            if (isOperator) {//isOperator true ou false
                if (this.isOperator(this._operation[index]) == isOperator) {//verica se é um numero
                    lastItem = this._operation[index];
                    break;
                } 
            } else {//falso = um numero
                lastItem = this._operation[index];
                break;
            } 
        }
        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastN = this.getLastItem(false);
        console.log("lastN" + lastN);
        if(!lastN) {
            lastN = 0;
        }
        if (!this.isOperator(lastN)) {
            this.displayCalc = lastN;
        } else if(this._operation.length < 3 && (!isNaN(this._operation[0]))){
            this.displayCalc = this._operation[0];
        }
    }

    addOperation(value){//operacao da calculadora
        console.log("Ultima operacao " + isNaN(this.getLastOperation()));
        if (isNaN(this.getLastOperation())) {//string
            if (this.isOperator(value)) {//se for uma operador + - / *
                this.setLastOperation(value); //caso for um operador tem substituir
            } else {
                this.pushOperation(value); //coloca o elemento no final do array
                this.setLastNumberToDisplay();
            }
        } else {//number
            if (this.isOperator(value)) {//se for uma operador adiciona o elemento no array
                this.pushOperation(value);//exauta o push que adiconar o elemento e fazer calculo dos 3 elementos
            } else {//nao for faz concaternar numeros
                let newValue = this.getLastOperation().toString() + value.toString();//concatenar
                this.setLastOperation(newValue);   
            }
            this.setLastNumberToDisplay();
        }
        console.log(this._operation);
    }
    setError(){//erro
        this.displayCalc = "Error";
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) 
            return;//se existe e for string se tiver ponto nao faca nada

        if (this.isOperator(lastOperation) || !lastOperation) {//caso for vazio ou um operador
            this.pushOperation("0.");
        } else {//caso for um numero 
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    exectBtn(value){
        this.playAudio();
        switch (value) {
            case "ac":
                this.clearAll();
                break;
            case "ce":
                this.cancelEntry();
                break;
            case "soma":
                this.addOperation("+");
                break;
            case "subtracao":
                this.addOperation("-");
                break;
            case "multiplicacao":
                this.addOperation("*");
                break;
            case "divisao":
                this.addOperation("/");
                break;
            case "porcento":
                this.addOperation("%");
                break;
            case "igual":
                this.calc();
                break;
            case "ponto":
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents(){// botao
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn,index)=>{
                this.addEventListenerAll(btn,'click drag', e=>{
                    let textBtn = btn.className.baseVal.replace("btn-","");
                    this.exectBtn(textBtn);
                });

                this.addEventListenerAll(btn,"mouseover mouseup mousedown", e=>{
                    btn.style.cursor = "pointer";
                });
            });
    }

    setDisplayDateTime(){//data e hora atual
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
    //gets and sets
    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }
    
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        if (value.toString().length>10) {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }
}