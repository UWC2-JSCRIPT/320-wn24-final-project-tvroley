class Mongo {
  constructor() {}

  login(email, password) {
    return fetch(
      `https://trading-cards-backend-production.up.railway.app/auth/login`,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      },
    );
  }

  signup(email, username, password) {
    return fetch(
      `https://trading-cards-backend-production.up.railway.app/auth/signup`,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,
        }),
      },
    );
  }

  changePassword(password) {
    let urlPassword = new URL(
      `https://trading-cards-backend-production.up.railway.app/auth/password`,
    );
    return fetch(urlPassword, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ password: password }),
    });
  }

  deleteAccount() {
    let urlPassword = new URL(
      `https://trading-cards-backend-production.up.railway.app/auth/delete`,
    );
    return fetch(urlPassword, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("cardsToken"),
      },
    });
  }

  deleteCard(cardId) {
    let urlDeleteCard = new URL(
      `https://trading-cards-backend-production.up.railway.app/cards/` + cardId,
    );
    return fetch(urlDeleteCard, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("cardsToken"),
      },
    });
  }
}

export default Mongo;
