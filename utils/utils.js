function convertToNumber(input) {
    if (!input) return null
    const cleanedString = input.replace(/,/g, '.');
    const numericString = cleanedString.replace(/[^\d.]/g, '');
    const result = parseFloat(numericString);
    return isNaN(result) ? null : result;
  }


module.exports  = {convertToNumber}