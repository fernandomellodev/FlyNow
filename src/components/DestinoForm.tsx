import React, { useState } from 'react';
import { ContatoForm, Destino } from '../types/destino';

interface DestinoFormProps {
  destinosDisponiveis: Destino[];
  onEnviarContato: (dados: ContatoForm) => void;
}

export const DestinoForm: React.FC<DestinoFormProps> = ({
  destinosDisponiveis,
  onEnviarContato,
}) => {
  // Requisito 3: Formulário 100% controlado com useState
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [destinoInteresse, setDestinoInteresse] = useState<string>('');
  const [mensagem, setMensagem] = useState<string>('');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim()) {
      alert('Por favor, preencha pelo menos o nome e o e-mail.');
      return;
    }

    const dadosEnvio: ContatoForm = {
      nome,
      email,
      destinoInteresse: destinoInteresse || 'Não especificado',
      mensagem,
    };

    // Propaga via props para o componente pai + log no console (e-mail/mensagem visíveis no DevTools)
    console.log('📩 DestinoForm envio:', dadosEnvio);
    onEnviarContato(dadosEnvio);

    setMensagemSucesso(`Obrigado pelo seu interesse no destino "${dadosEnvio.destinoInteresse}"! Em breve nossa equipe entrará em contato, ${nome}.`);

    // Limpa os campos mantendo o estado controlado
    setNome('');
    setEmail('');
    setDestinoInteresse('');
    setMensagem('');
  };

  return (
    <section className="form-secao" id="contato">
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-titulo">Fale com um Especialista da FlyNow</h2>
          <p className="form-subtitulo">Preencha seus dados e destino desejado. Nossa equipe retorna em até 24h.</p>
        </div>

        {mensagemSucesso && (
          <div className="alerta-sucesso">
            <span>🎉</span>
            <div>
              <strong>Sucesso!</strong>
              <p>{mensagemSucesso}</p>
            </div>
            <button
              type="button"
              className="btn-fechar-alerta"
              onClick={() => setMensagemSucesso(null)}
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="contato-form">
          <div className="form-linha">
            <div className="form-grupo">
              <label htmlFor="campo-nome" className="form-label">
                Nome Completo <span className="obrigatorio">*</span>
              </label>
              <input
                id="campo-nome"
                type="text"
                className="form-input"
                placeholder="Ex.: Ana Souza"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-grupo">
              <label htmlFor="campo-email" className="form-label">
                E-mail Corporativo / Pessoal <span className="obrigatorio">*</span>
              </label>
              <input
                id="campo-email"
                type="email"
                className="form-input"
                placeholder="Ex.: ana.souza@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-grupo">
            <label htmlFor="campo-destino" className="form-label">
              Destino de Interesse
            </label>
            <select
              id="campo-destino"
              className="form-select"
              value={destinoInteresse}
              onChange={(e) => setDestinoInteresse(e.target.value)}
            >
              <option value="">Selecione um destino (ou deixe em aberto)...</option>
              {destinosDisponiveis.map((d) => (
                <option key={d.id} value={d.cidade}>
                  {d.cidade}
                </option>
              ))}
            </select>
          </div>

          <div className="form-grupo">
            <label htmlFor="campo-mensagem" className="form-label">
              Mensagem ou Preferências de Viagem
            </label>
            <textarea
              id="campo-mensagem"
              rows={3}
              className="form-textarea"
              placeholder="Ex.: Gostaria de receber cotações de passagens e pacotes para viajar em família..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />
          </div>

          <div className="form-acoes">
            <button type="submit" className="btn-submit">
              Enviar Mensagem
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
