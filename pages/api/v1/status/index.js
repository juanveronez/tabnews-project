function status(_, response) {
  response.status(200).json({ mensagem: "A aplicação parece saudável!" });
}

export default status;
