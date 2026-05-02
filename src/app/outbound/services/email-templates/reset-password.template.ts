interface ResetPasswordTemplateInput {
  userName: string;
  resetUrl: string;
}

interface ResetPasswordTemplateOutput {
  subject: string;
  html: string;
  text: string;
}

export function resetPasswordTemplate(
  input: ResetPasswordTemplateInput,
): ResetPasswordTemplateOutput {
  const safeName = escapeHtml(input.userName);
  const safeUrl = escapeHtml(input.resetUrl);

  return {
    subject: "Réinitialisation de votre mot de passe",
    html: `<!doctype html>
<html lang="fr">
  <body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
    <p>Bonjour ${safeName},</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour en définir un nouveau&nbsp;:</p>
    <p><a href="${safeUrl}">Réinitialiser mon mot de passe</a></p>
    <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
  </body>
</html>`,
    text: `Bonjour ${input.userName},

Vous avez demandé à réinitialiser votre mot de passe. Ouvrez ce lien pour en définir un nouveau (valable 1 heure) :

${input.resetUrl}

Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.`,
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}
