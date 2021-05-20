const Modal = {
    open(){
        // Abrir o modal
        // Adicionar a class active ao modal
        // alert('Abri o modal') // aspas simples é um argumento
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close(){
        // Fechar o modal
        // Remover a class ative do modal
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    },
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [] // temos que transformar o array anteriormente transformado em string para array novamente
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions)) // JSON transforma um array em uma string
    }
}
// Somar as entradas
// Somar as saídas e 
// Remover das entradas o valor das saídas
// Assim, terei o total


const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1) // o splice é um método que se usa no array

        App.reload()
    },

    incomes() {
        let income = 0;
        // pegar todas as transações
        // para cada transação 
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }

        })
        
        //se ela for maior que 0 (income), se for menor que zero (expenses)
        // somar a uma variável e retornar a variável
        return income;
        // somar as entradas
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }

        })  
        return expense;

    },

    total() {
        return Transaction.incomes() + Transaction.expenses() ;
    }
}

// Substituir os dados do HTML com os dados do JS

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) { // index é a posição do array do objeto
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction, index) { // HTML interno de uma transação
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
             <td Class = "description">${transaction.description}</td>
             <td class = "${CSSclass}">${amount}</td>
             <td class = "date">${transaction.date}</td>
             <td>
                 <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
             </td>
         
        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-") // splitted se aplica a strings
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "") // /\D/ é uma expressão regular, o D maisculo irá achar somente os números e o "g" é um termo para fazer uma busca global

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues ()
        if ( description.trim() === "" ||
             amount.trim() === "" ||
             date.trim() === "") {
                 throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()
        
        amount = Utils.formatAmount(amount)
        
        date = Utils.formatDate(date)

        return {
            description, 
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()
        // Verificar se todas as informações foram preechidas
        
        try {
            Form.validateFields()
        // Formatar os dados para salvar
            const transaction = Form.formatValues()
        // Salvar
            Transaction.add(transaction)
        // Apagar os dados do formulário
            Form.clearFields()
        // Fechar Modal
            Modal.close()
        // Atualizar a aplicação - App.reload(), como ja tem lá em cima no App não precisamos colocar novamente
            
        } catch (error) {
            alert(error.message)    
        }

        
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)        
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()