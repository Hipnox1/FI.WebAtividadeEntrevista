obj=0
$(document).ready(function () {
    // Array para armazenar os benefici�rios
    var beneficiarios = [];

    // Fun��o para adicionar benefici�rio ao array
    function adicionarBeneficiario(cpf, nome) {
        if (!beneficiarios.find(b => b.cpf === cpf)) {
            beneficiarios.push({ 'nome': nome, 'cpf': cpf });
            window.beneficiarios = beneficiarios;
            atualizarGrid();
        } else {
            ModalDialog("Ocorreu um erro", "Beneficiarios com CPFs duplicados");
        }
    }

    // Manipula o envio do formul�rio de benefici�rios
    $('#formBeneficiarios').submit(function (event) {
        event.preventDefault();

        // Obt�m os valores dos campos
        var cpf = $('#cpfBeneficiario').val();
        var nome = $('#nomeBeneficiario').val();

        if (cpf && nome) {
            $.ajax({
                url: urlValidaBeneficiarioCPF,
                method: "POST",
                data: {
                    "CPF": cpf
                },
                error: function (r) {
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
                success: function (valid) {
                    if (valid) {
                        adicionarBeneficiario(cpf, nome);
                    } else {
                        ModalDialog("Ocorreu um erro", "CPF inv�lido.");
                    }
                }
            });
        } else {
            ModalDialog("Ocorreu um erro", "Campos n�o preenchidos no benefici�rio.");
        }

        // Limpa os campos do formul�rio
        $('#cpfBeneficiario').val('');
        $('#nomeBeneficiario').val('');
    });

    // Fun��o para atualizar o grid de benefici�rios
    function atualizarGrid() {
        // Limpa o conte�do atual do grid
        $('#beneficiariosGrid tbody').empty();
        // Preenche o grid com os dados dos benefici�rios
        beneficiarios.forEach(function (beneficiario) {
            var row = '<tr>' +
                '<td>' + beneficiario.cpf + '</td>' +
                '<td>' + beneficiario.nome + '</td>' +
                '<td><button class="btn btn-primary btn-sm" onclick="alterarBeneficiario(\'' + beneficiario.cpf + '\')">Alterar</button></td>' +
                '<td><button class="btn btn-primary btn-sm" onclick="excluirBeneficiario(\'' + beneficiario.cpf + '\')">Excluir</button></td>' +
                '</tr>';

            $('#beneficiariosGrid tbody').append(row);
        });
    }

    // Fun��o para alterar um benefici�rio
    window.alterarBeneficiario = function (cpf) {
        // Encontra o benefici�rio no array
        var beneficiario = beneficiarios.find(function (b) {
            return b.cpf === cpf;
        });

        // Preenche os campos do formul�rio com os dados do benefici�rio para edi��o
        $('#cpfBeneficiario').val(beneficiario.cpf);
        $('#nomeBeneficiario').val(beneficiario.nome);

        // Remove o benefici�rio do array (opcional, dependendo do requisito)
        var index = beneficiarios.findIndex(function (b) {
            return b.cpf === cpf;
        });
        if (index !== -1) {
            beneficiarios.splice(index, 1);
        }

        // Atualiza o grid
        atualizarGrid();
    };

    // Fun��o para excluir um benefici�rio
    window.excluirBeneficiario = function (cpf) {
        // Encontra o benefici�rio no array
        var index = beneficiarios.findIndex(function (b) {
            return b.cpf === cpf;
        });

        // Remove o benefici�rio do array
        beneficiarios.splice(index, 1);

        // Atualiza o grid
        atualizarGrid();
    };

    // Se houver dados iniciais, carrega-os
    if (obj && obj.Beneficiarios) {
        obj.Beneficiarios.forEach(function (value) {
            adicionarBeneficiario(value['CPF'], value['Nome']);
        });
    }
});
