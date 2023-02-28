const http = require("http");
const { randomUUID } = require("crypto")


/** PACKAGE.JSON
 * Package.json é um arquivo de configuração do projeto, nele tem qual o nome, a versão que está
 * trabalhando, o arquivo principal, o autor.
 * 
 * Nele possui as depêndencias e eles podem ser: 
 * - devs depends que é utilizada no ambiente de desenvolvimento 
 * - depêndencias normais utiliza quando vai subir para produção
 * 
 * No arquivo, na parte "scripts" ao substituir "test" por "dev" ocorre atulização toda vez que
 * ocorrer uma mudança no arquivo e ela for salva
 * "scripts": {
 *  "dev": "nodemon index.js"
 */


/**
 * GET - Buscar um dado
 * POST - Inserir um dado
 * PUT - Alterar um dado
 * DELETE - Remover um dados
 */



/**
 * É preciso colocar o array const users = []; fora para que quando for fazer uma nova
 * requisição tenha um array fora.
 */
const users = [];
/**
 * req (request): tudo que o cliente enviar para o servidor. Exemplo> login, user, password
 * res (respose): tudo que vai retornar para o usuário.
 */
// quando não há nada no parâmetro ele não irpa retornar nada
const server = http.createServer((request, response) => {
    

    /** 
     * É preciso fazer uma verificação para ver se url é igual a "/users" e se for ele irá retornar
     * uma resposta para o usuário -- para isso é usado o return response
     */
    if(request.url === "/users") {
        if(request.method === "GET") {
            return response.end(JSON.stringify(users));
        }

    /**
     * O browser não permite chamadas POST apenas GET
     */

        if(request.method === "POST") {
        /** 
         * por meio do método request.on("data") é possível pegar as informações do usuário
         * primeiro paramêtro do request.on("primeiro parametro", (segundo parametro)) 
         * é o tipo de evento e o segundo é o obejto que agente que receber da requisição
         * 
         * Irá retornar como buffer e será preciso converter para uma forma que seja possível
         * entender -- CONVERTER O DATA PARA JSON usando JSON.parse(data)
         */
        request.on("data", (data) => {

            const dataUser = JSON.parse(data);

            const user = {
                id: randomUUID(),
                ...dataUser
            };

            users.push(user);

        })
        /**
         * Irá finalizar tudo que tem no request.on("data"...) e após finalizar o processamento
         * irá retornar uma resposta, que no caso será o user
         */
        .on("end", () => {
            // n.stringify() transforma tudo que estiver dentro em string
            return response.end(JSON.stringify(users));
        });
    }
    

  }
  /**
   * Essa verificação irá ver se o url começa com "/users" e se começar ele irá enviar o método 
   * PUT que retornará o user
   * 
   * Quebra a URL para pegar o id do usuário, irá percorrer o array para encontrar o que irá alterar
   * converte o data em JSON e irá alterar o array na posição do usuário e então retorna o user.
   * */  
  if(request.url.startsWith("/users")) {
    if(request.method === "PUT") {
        const url = request.url;
        const splitURL = url.split("/");

        const idUser = splitURL[2];

        const userIndex = users.findIndex(user => user.id === idUser);
        

        request
        .on("data", (data) => {
            const dataUser = JSON.parse(data);

            users[userIndex] = {
                id: idUser,
                ...dataUser
            }
        }).on("end", () =>{
            return response.end(JSON.stringify(users))
        })

    }
  }

});

// listen(4000) é a porta que irá rodar o servidor
server.listen(4000, () => console.log("Server is running on PORT 4000"));
