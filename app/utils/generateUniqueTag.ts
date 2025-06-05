export function generateUniqueTag() {
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let tag = '@';
    for (let i = 0; i < 5; i++) {
      tag += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return tag;
  }
  