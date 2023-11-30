obj=0
$(document).ready(function () {
    // Array para armazenar os beneficiários
    var beneficiarios = [];

    // Função para adicionar beneficiário ao array
    function adicionarBeneficiario(cpf, nome) {
        if (!beneficiarios.find(b => b.cpf === cpf)) {
            beneficiarios.push({ 'nome': nome, 'cpf': cpf });
            window.beneficiarios = beneficiarios;
            atualizarGrid();
        } else {
            ModalDialog("Ocorreu um erro", "Beneficiarios com CPFs duplicados");
        }
    }

    // Manipula o envio do formulário de beneficiários
    $('#formBeneficiarios').submit(function (event) {
        event.preventDefault();

        // Obtém os valores dos campos
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
                        ModalDialog("Ocorreu um erro", "CPF inválido.");
                    }
                }
            });
        } else {
            ModalDialog("Ocorreu um erro", "Campos não preenchidos no beneficiário.");
        }

        // Limpa os campos do formulário
        $('#cpfBeneficiario').val('');
        $('#nomeBeneficiario').val('');
    });

    // Função para atualizar o grid de beneficiários
    function atualizarGrid() {
        // Limpa o conteúdo atual do grid
        $('#beneficiariosGrid tbody').empty();
        // Preenche o grid com os dados dos beneficiários
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

    // Função para alterar um beneficiário
    window.alterarBeneficiario = function (cpf) {
        // Encontra o beneficiário no array
        var beneficiario = beneficiarios.find(function (b) {
            return b.cpf === cpf;
        });

        // Preenche os campos do formulário com os dados do beneficiário para edição
        $('#cpfBeneficiario').val(beneficiario.cpf);
        $('#nomeBeneficiario').val(beneficiario.nome);

        // Remove o beneficiário do array (opcional, dependendo do requisito)
        var index = beneficiarios.findIndex(function (b) {
            return b.cpf === cpf;
        });
        if (index !== -1) {
            beneficiarios.splice(index, 1);
        }

        // Atualiza o grid
        atualizarGrid();
    };

    // Função para excluir um beneficiário
    window.excluirBeneficiario = function (cpf) {
        // Encontra o beneficiário no array
        var index = beneficiarios.findIndex(function (b) {
            return b.cpf === cpf;
        });

        // Remove o beneficiário do array
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
