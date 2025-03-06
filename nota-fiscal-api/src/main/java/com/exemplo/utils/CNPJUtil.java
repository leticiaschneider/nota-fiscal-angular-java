package com.exemplo.utils;

public class CNPJUtil {
    public static String limparCNPJ(String cnpj) {
        return cnpj.replaceAll("\\D", "");
    }

    public static boolean validarCNPJ(String cnpj) {
        cnpj = limparCNPJ(cnpj);

        if (cnpj.length() != 14) {
            return false;
        }

        if (cnpj.matches("(\\d)\\1{13}")) {
            return false;
        }

        int[] pesos1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] pesos2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

        if (!validarDigito(cnpj, pesos1, 12) || !validarDigito(cnpj, pesos2, 13)) {
            return false;
        }

        return true;
    }

    private static boolean validarDigito(String cnpj, int[] pesos, int posicao) {
        int soma = 0;
        for (int i = 0; i < pesos.length; i++) {
            soma += (cnpj.charAt(i) - '0') * pesos[i];
        }

        int resto = soma % 11;
        int digitoVerificador = (resto < 2) ? 0 : (11 - resto);

        return cnpj.charAt(posicao) - '0' == digitoVerificador;
    }
}
