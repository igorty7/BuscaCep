class EnderecoService {
    constructor() {
        this.form = document.getElementById('form-cep')
        this.cepInput = document.getElementById('cep')
        this.ruaInput = document.getElementById('rua')
        this.bairroInput = document.getElementById('bairro')
        this.cidadeInput = document.getElementById('cidade')
        this.ufInput = document.getElementById('uf')
        this.numeroInput = document.getElementById('numero')
        this.complementoInput = document.getElementById('complemento')
        this.errorSpan = document.getElementById('cep-error')

        this.init()
    }

    init() {
        this.cepInput.addEventListener('blur', () => this.buscarCep())

        this.cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, "")
            if (value.length > 5) {
                value = value.substring(0, 5) + "-" + value.substring(5, 8)
            }
            e.target.value = value
        })

        this.form.addEventListener('submit', (e) => this.enviarDados(e))
    }

    async enviarDados(e) {
        e.preventDefault()

        if (this.cepInput.value === "") {
            this.mostrarErro("Preencha o CEP antes de continuar.")
            return
        }

        if (this.ruaInput.value === "") {
            await this.buscarCep()
            if (this.ruaInput.value === "") return
        }

        const params = new URLSearchParams({
            cep: this.cepInput.value,
            rua: this.ruaInput.value,
            bairro: this.bairroInput.value,
            cidade: this.cidadeInput.value,
            uf: this.ufInput.value,
            numero: this.numeroInput.value,
            complemento: this.complementoInput.value
        })

        window.location.href = `resultado.html?${params.toString()}`
    }

    async buscarCep() {
        const cep = this.cepInput.value.replace(/\D/g, '')
        this.limparErro()

        if (cep === "") return

        if (cep.length !== 8) {
            this.mostrarErro("CEP inválido.")
            return
        }

        try {
            this.definirCarregando(true)
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

            if (!response.ok) throw new Error('Erro na conexão.')

            const dados = await response.json()

            if (dados.erro) throw new Error('CEP não encontrado.')

            this.preencherFormulario(dados)
            this.numeroInput.focus()

        } catch (error) {
            console.error(error)
            this.mostrarErro(error.message)
            this.limparFormulario()
        } finally {
            this.definirCarregando(false)
        }
    }

    preencherFormulario(dados) {
        this.ruaInput.value = dados.logradouro
        this.bairroInput.value = dados.bairro
        this.cidadeInput.value = dados.localidade
        this.ufInput.value = dados.uf
    }

    limparFormulario() {
        this.ruaInput.value = ""
        this.bairroInput.value = ""
        this.cidadeInput.value = ""
        this.ufInput.value = ""
    }

    mostrarErro(mensagem) {
        this.cepInput.classList.add('input-error')
        this.errorSpan.innerText = mensagem
    }

    limparErro() {
        this.cepInput.classList.remove('input-error')
        this.errorSpan.innerText = ""
    }

    definirCarregando(estado) {
        if (estado) {
            this.ruaInput.value = "..."
            this.bairroInput.value = "..."
            this.cidadeInput.value = "..."
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EnderecoService()
})