function generateRandomPassword(length = 8) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const characterCount = characters.length;
  let randomPassword = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterCount);
    randomPassword += characters.charAt(randomIndex);
  }

  return randomPassword;
}

module.exports = {
  generateRandomPassword,
};
