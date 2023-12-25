package com.devjk.djtrinity.framework.utils

class TrinityUtils {
    companion object {
        fun base16ToDecimal(base16: String): Int {
            try {
                return base16.toInt(16)
            } catch (e: Exception) {
                e.printStackTrace()
                throw RuntimeException("Error to parse base16toDecimal : $base16")
            }
        }

        fun base36ToDecimal(base36: String): Int {
            var base36 = base36
            try {
                if (base36.length != 2) {
                    throw RuntimeException("base36 should be 두자릿수 : $base36")
                }
                base36 = base36.uppercase()
                val first = base36[1]
                val second = base36[0]
                val firstNum = if (Character.isDigit(first)) {
                    Character.getNumericValue(first)
                } else if (Character.isAlphabetic(first.code)) {
                    first.code - 'A'.code + 10
                } else {
                    throw RuntimeException("first should be numeric or alphabetic : $first")
                }
                val secondNum = if (Character.isDigit(second)) {
                    Character.getNumericValue(second)
                } else if (Character.isAlphabetic(second.code)) {
                    second.code - 'A'.code + 10
                } else {
                    throw RuntimeException("second should be numeric or alphabetic : $second")
                }
                return firstNum + secondNum * 36
            } catch (e: Exception) {
                e.printStackTrace()
                throw RuntimeException("Error to parse base36toDecimal : $base36")
            }
        }
    }
}