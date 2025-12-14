document.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search)

            const preencher = (id, param) => {
                const valor = params.get(param)
                document.getElementById(id).textContent = valor ? valor : '-'
            }

            preencher('res-cep', 'cep')
            preencher('res-rua', 'rua')
            preencher('res-numero', 'numero')
            preencher('res-comp', 'complemento')
            preencher('res-bairro', 'bairro')
            preencher('res-cidade', 'cidade')
            preencher('res-uf', 'uf')
        })