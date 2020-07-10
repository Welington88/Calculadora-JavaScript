class CalcController {
    constructor(){//construtor
        this._operantion = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){//inializar a calculadora
        this.setDisplayDateTime();

        let interval = setInterval(()=>{
            this.setDisplayDateTime();
        },1000);

        /*setTimeout(()=>{
            clearInterval(interval);
        });//stop the interval*/
    }

    addEventListenerAll(element, events, fn){// por evento do click do mouse a passar mouse por cima
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    }
    
    clearAll(){//limpar a calculadora
        this._operantion = [];
    }

    cancelEntry(){//cancela ultima operacao
        this._operantion.pop(); //elemina o ultimo elemento do push
    }

    getLastOperantion(){//ultima operacao
       return this._operantion[this._operantion.length-1];
       
    }

    setLastOperantion(value){//colocar na mesma posicao do array
        this._operantion[this._operantion.length-1] = value;
    }

    isOperator(value){
        return (['+','-','*', '/', '%'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operantion.push(value);
        if (this._operantion>3) {
            this.calc();
        } else {
            
        }
    }

    calc(){
        let last = this._operantion.pop();//tira ultimo elemento do array
        let result = eval(this._operantion.join("")); // join pegar um string tira as virgulas e excuta o que tem dentro
        this._operantion = [result,last];//novo array
    }

    setLastNumberToDisplay(){
        for (let index = (this._operantion.length-1); index >= 0; index--) {//decrementar até final do array
            console.log(index);
            if (!this.isOperator(this._operantion[index])) {//verica se é um operador
                lastNumber = index;
                break;
            } 
        }
        this.displayCalc =lastNumber;
    }

    addOperantion(value){//operacao da calculadora
        console.log("Ultima operacao " + isNaN(this.getLastOperantion()));
        if (isNaN(this.getLastOperantion())) {//string
            if (this.isOperator(value)) {//se for uma operador + - / *
                this.setLastOperantion(value); //caso for um operador tem substituir
            }else if(isNaN(value)){

            } else {
                this.pushOperation(value); //coloca o elemento no final do array
                this.setLastNumberToDisplay();
            }
        } else {//number
            if (this.isOperator(value)) {//se for uma operador adiciona o elemento no array
                this.pushOperation(value);//exauta o push que adiconar o elemento e fazer calculo dos 3 elementos
            } else {//nao for faz concaternar numeros
                let newValue = this.getLastOperantion().toString() + value.toString();//concatenar
                this.setLastOperantion(parseInt(newValue));   
            }
            this.setLastNumberToDisplay();
        }
        console.log(this._operantion);
    }
    setError(){//erro
        this.displayCalc = "Error";
    }

    exectBtn(value){
        console.log(value);
        switch (value) {
            case "ac":
                this.clearAll();
                break;
            case "ce":
                this.cancelEntry();
                break;
            case "soma":
                this.addOperantion("+");
                break;
            case "subtracao":
                this.addOperantion("-");
                break;
            case "multiplicacao":
                this.addOperantion("*");
                break;
            case "divisao":
                this.addOperantion("/");
                break;
            case "porcento":
                this.addOperantion("%");
                break;
            case "igual":
            
                break;
            case "ponto":
                this.addOperantion(".");
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
                this.addOperantion(parseInt(value));
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
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }
}