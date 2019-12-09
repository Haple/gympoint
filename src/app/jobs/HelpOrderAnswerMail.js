import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswer';
  }

  async handle({ data }) {
    const { question, answer, student, email } = data;

    await Mail.sendMail({
      to: `${student} <${email}>`,
      subject: 'Resposta do pedido de ajuda',
      template: 'help-order-answer',
      context: { question, answer, student, email },
    });
  }
}

export default new HelpOrderAnswerMail();
