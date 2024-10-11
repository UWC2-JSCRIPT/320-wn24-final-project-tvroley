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
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ password: password }),
    });
  }

  changePasswordWithToken(password, token) {
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
        Authorization: "Bearer " + token,
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
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
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
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
    });
  }

  getAllCards() {
    let urlGetAllCards = new URL(
      `https://trading-cards-backend-production.up.railway.app/cards/`,
    );
    return fetch(urlGetAllCards, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  searchCardsInCollection(collectionId, searchQuery){
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections/` +
        collectionId,
    );
    url.searchParams.append("verbose", "true");
    url.searchParams.append("search", searchQuery);
    return fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  searchAllCards(searchQuery) {
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/cards/search`,
    );
    url.searchParams.append("search", searchQuery);
    return fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  hash(password) {
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/auth/hash`,
    );
    url.searchParams.append("password", password);
    return fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  encrypt(password) {
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/auth/encrypt`,
    );
    url.searchParams.append("password", password);
    return fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  decrypt(password) {
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/auth/encrypt`,
    );
    url.searchParams.append("password", encodeURIComponent(password));
    url.searchParams.append("option", "reverse");
    return fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  getCollections(username){
    let urlGetCollections = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections`,
    );
    urlGetCollections.searchParams.append("ownerName", username);
    return fetch(urlGetCollections, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  getCardsInCollection(collectionId){
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections/` +
        collectionId,
    );
    url.searchParams.append("verbose", "true");
    return fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  getCollectionsCount(){
    let countUrl = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections/collectionscount`,
    );
    return fetch(countUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  }

  addCollection(addedCollection){
    const titleObj = { collectionTitle: addedCollection };
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections/`,
    );
    return fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(titleObj),
    });
  }
}

export default Mongo;
