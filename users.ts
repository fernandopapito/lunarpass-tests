


// function buscarUsuario(): string {
//     let nome = ''

//     // Simulação de um operação demorada (API, banco, etc...)
//     setTimeout(()=> {
//         nome = 'Papito'
//     }, 2000)

//     return nome
// }

function buscarUsuario(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(()=> resolve('Papito'), 2000)
    })
}

async function exibirUsuario() {
    console.log('Antes')

    const nome = await buscarUsuario()
    console.log(nome)

    console.log('Depois')
}

exibirUsuario()