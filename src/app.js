'use strict'
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const chatbot = new Telegram.Telegram('473007961:AAEaLMNx0W9zPhXMM0Jwpe3PEkPbQNkEee4', {
    webAdmin: {
        port: 8080,
        host: '0.0.0.0'
    }
});
const _ = require('underscore');
//1 - tudo em maiúsculo
//2 - Não há pontuação ou sinais gráficos (acento, til)
//3 - substituição
//B = P
//Ç = S depois de consoante e SS depois de vogal
//D = T
//G = X (com E, I), C (com A, O, UA, UO) ou Q (com UE, UI)
//J = X
//S solto entre vogais no meio da palavra = SS
//V = F
//Z = S (no início da palavra) ou SS (meio da palavra)

const dicionario = [
	{
		char : /(J)/g,
		replaceChar: 'X'
	},
	{
		char : /(B)/g,
		replaceChar: 'P'
	},
	{
		position : 'first',
		char : /(Ç)([AEIOU])/g,
		replaceChar: 'SS'
	},
	{
		position : 'first',
		char : /(Ç)([^AEIOU])/g,
		replaceChar: 'S'
	},
	{
		char : /(D)/g,
		replaceChar: 'T'
	},
	{
		position : 'first',
		char : /(G)([EI])/g,
		replaceChar: 'X'
	},
	{
		position : 'first',
		char : /(G)(A|O|UA|UO)/g,
		replaceChar: 'C'
	},
	{
		position : 'first',
		char : /(G)(UE|UI)/g,
		replaceChar: 'Q'
	},
	{
		position : 'middle',
		char : /([AEIOU])(S)([AEIOU])/g,
		replaceChar: 'SS'
	},
	{
		char : /V/g,
		replaceChar: 'F'
	},
	{
		position : 'middle',
		char : /(\w)([Z])(\w)/g,
		replaceChar: 'SS'
	},
	{
		char : /Z$/,
		replaceChar: 'S'
	},
	{
		char : /Z/,
		replaceChar: 'S'
	}
]

var map={"â":"a","Â":"A","à":"a","À":"A","á":"a","Á":"A","ã":"a","Ã":"A","ê":"e","Ê":"E","è":"e","È":"E","é":"e","É":"E","î":"i","Î":"I","ì":"i","Ì":"I","í":"i","Í":"I","õ":"o","Õ":"O","ô":"o","Ô":"O","ò":"o","Ò":"O","ó":"o","Ó":"O","ü":"u","Ü":"U","û":"u","Û":"U","ú":"u","Ú":"U","ù":"u","Ù":"U"};

function removerAcentos(s){ return s.replace(/[\W\[\] ]/g,function(a){return map[a]||a}) };





class HelloController extends TelegramBaseController {
	
	startAction(scope) {
    	let msg = 'COE FERME POTE FALAR QUE EU FO REPETIR';
		scope.sendMessage(msg)
  	}
	
	get routes() {
    	return {
      		'start': 'startAction'
    	}
  	}

}

class TranslateController extends TelegramBaseController {

	handle(scope) {
		let msg = removerAcentos(scope.message.text.toUpperCase()).replace(/[.,?!:;]/g,'');
		let response = '';
		_.each(msg.split(/\s+/),function(word) {
			word = word.trim();
			_.each(dicionario,function(term) {
				if (term.position == 'first') {
					word = word.replace(term.char,term.replaceChar+'$2');
				} else if (term.position == 'middle') {
					word = word.replace(term.char,'$1'+term.replaceChar+'$3');
				} else {
					word = word.replace(term.char,term.replaceChar);
				}
				
			});
			response = response + ' ' + word;
		});
        scope.sendMessage(response);
    }

}

chatbot.router
       .when(new TextCommand('/start', 'start'), new HelloController())
       .otherwise(new TranslateController());