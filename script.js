document.addEventListener("DOMContentLoaded", () => {
  const allowedUsers = [
    "arivag", "marzur", "dailub", "zilkun", "svebli", "inebun", "astbuk",
    "inegol", "eglkav", "edilen", "marmel", "enrrag", "karsra", "ugnand",
    "emirus", "valser", "raisim", "rashag", "rasjau", "ilmnor", "greval",
    "simles", "kribos", "anggel", "jurbel", "virrut", "vaizar"
  ];

  document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      checkLogin();
    }
  });

  document.getElementById("error-message").classList.add("hidden");
});

function checkLogin() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  if (allowedUsers.includes(input)) {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
  } else {
    document.getElementById("error-message").classList.remove("hidden");
  }
}
