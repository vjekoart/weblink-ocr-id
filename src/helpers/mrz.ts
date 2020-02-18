export interface MrzInformation {
    data: MrzData;
    validity: MrzValidity;
}

export interface MrzData {
    dateOfBirth: string;
    dateOfExpiry: string;
    documentNumber: string;
    primaryIdentifier: string;
    secondaryIdentifier: string;
}

export interface MrzValidity {
    dateOfBirth: boolean;
    dateOfExpiry: boolean;
    documentNumber: boolean;
}

export interface MrzUtilityInterface {
    extractMrzInformation (mrzString: string): MrzInformation;
}

export class MrzUtility implements MrzUtilityInterface {
    /**
     * Extracts MRZ information from given MRZ string. Type 'MrzInformation'
     * is returned, which contains extracted information and data validity
     * states.
     */
    public extractMrzInformation (mrzString: string): MrzInformation {
        const mrzLines = mrzString.split('\n')

        // Document number and check digit
        const documentNumber = mrzLines[0].substring(5, 14)
        const isDocumentNumberValid = this.isValid(documentNumber, mrzLines[0][14])

        // Date of birth and check digit
        const dateOfBirth = mrzLines[1].substring(0, 6)
        const isDateOfBirthValid = this.isValid(dateOfBirth, mrzLines[1][6])

        // Date of expiry and check digit
        const dateOfExpiry = mrzLines[1].substring(8, 14)
        const isDateofExpiryValid = this.isValid(dateOfExpiry, mrzLines[1][14])

        // Primary & secondary identifiers
        const rawIdentifiers = mrzLines[2].split('<<')
        const primaryIdentifier = this.cleanWord(rawIdentifiers[0])
        const secondaryIdentifier = this.cleanWord(rawIdentifiers[1])

        return {
            data: {
                dateOfBirth,
                dateOfExpiry,
                documentNumber,
                primaryIdentifier,
                secondaryIdentifier
            },
            validity: {
                dateOfBirth: isDateOfBirthValid,
                dateOfExpiry: isDateofExpiryValid,
                documentNumber: isDocumentNumberValid
            }
        }
    }

    /**
     * Returns true or false based on the input data and check digit.
     */
    private isValid (data: string, checkDigit: string): boolean {
        // Check input parameters
        const safeData = data || ''

        const safeCheckDigit = parseInt(checkDigit, 10)

        if (isNaN(safeCheckDigit)) {
            return false
        }

        // Verify check digit
        const factors = '731'
        const products: Array<number> = []

        for (let i = 0; i < safeData.length; ++i) {
            const characterFactor = this.getCharacterFactor(safeData[i])
            const product = characterFactor * parseInt(factors[i % 3])

            products.push(product)
        }

        let sum = 0

        for (const product of products) {
            sum += product
        }

        return (sum % 10) === safeCheckDigit
    }

    /**
     * Based on the input character, get factor for validity check. For
     * numbers, same number will be returned. For alphabetic characters,
     * factors starting from 10 will be returned.
     */
    private getCharacterFactor (character: string): number {
        const code = character.charCodeAt(0)

        // Numbers, character '1' should have code 1
        if (code >= 49 && code <= 57) {
            return code - 48
        }

        // Alphabetic characters, character 'A' should have code 10
        if (code >= 65 && code <= 90) {
            return code - 55
        }

        return 0
    }

    /**
     * Remove all '<' characters from given word. Aforementioned characterss
     * are replaced by space, ' ', and the whole word is trimmed at the end to
     * make sure that words like 'Anne Maria' are interpreted correctly.
     */
    private cleanWord (word: string): string {
        const finalWord: Array<string> = []

        for (const character of word) {
            if (character === '<') {
                finalWord.push(' ')
            } else {
                finalWord.push(character)
            }
        }

        return finalWord.join('').trim()
    }
}
