CREATE PROC FI_SP_DelBeneficiario
	@ID BIGINT,
	@IDCLIENTE BIGINT
AS
BEGIN
	DELETE BENEFICIARIOS WHERE ID = @ID AND IDCLIENTE = @IDCLIENTE
END