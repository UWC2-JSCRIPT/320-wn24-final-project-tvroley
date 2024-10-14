import "./App.css";
import { useEffect, useState } from "react";
import Mongo from "./Mongo";

function ManageCollections({}) {
  const [resultMessage, setResultMessage] = useState([]);
  const [collections, setCollections] = useState([]);
  const [username, setUsername] = useState(
    sessionStorage.getItem("cardsUsername"),
  );
  const server = new Mongo();

  useEffect(() => {
    const getData = async () => {
      const responseGetCollections = await server.getCollections(username);
      if (responseGetCollections.status === 200) {
        const data = await responseGetCollections.json();
        const myCollections = data.collections;
        setCollections(myCollections);
      }
    };

    getData();
  }, [resultMessage]);

  const deleteCollections = async (event) => {
    event.preventDefault();
    let totalResultMessage = [];
    const checkedCollections = [];
    const collectionsDivEl = document.getElementById("collections-div");
    const childDivs = collectionsDivEl.children;
    Array.from(childDivs).map((div) => {
      const collectLabel = div.firstElementChild;
      const collectCheckbox = div.lastElementChild;
      if (collectCheckbox.checked) {
        checkedCollections.push(collectLabel.textContent);
      }
    });
    const collectionsToRemoveObjs = [];
    checkedCollections.map((collect) => {
      const toDeleteArray = collections.filter((obj) => obj.title === collect);
      if (toDeleteArray.length > 0) {
        collectionsToRemoveObjs.push(toDeleteArray[0]);
      }
    });
    collectionsToRemoveObjs.map(async (collectObj) => {
      const collectionId = collectObj._id;
      const responseDeleteCollections =
        await server.deleteCollection(collectionId);
      if (responseDeleteCollections.status === 200) {
        totalResultMessage.push(
          `${collectObj.title} collection successfully deleted`,
        );
        setResultMessage(totalResultMessage);
      } else {
        totalResultMessage.push(
          `Could not delete ${collectObj.title} collection`,
        );
        setResultMessage(totalResultMessage);
      }
    });
  };

  return (
    <div className="div-add-cards">
      <h3>Manage Collections</h3>
      <form id="card-form" className="form-card">
        <div className="div-collections" id="collections-div">
          {Array.from(collections).map((collect) => {
            if (collect.title !== username) {
              return (
                <div
                  className="div-collection-check"
                  id={`${collect.title}-div`}
                  key={`${collect.title}-div`}
                >
                  <label
                    htmlFor={`${collect.title}-check`}
                    id={`${collect.title}-check-label`}
                    key={`${collect.title}-check-label`}
                  >
                    {collect.title}
                  </label>
                  <input
                    type="checkbox"
                    id={`${collect.title}-check`}
                    key={`${collect.title}-check`}
                  />
                </div>
              );
            }
          })}
        </div>
        <div className="div-input-group div-delete">
          <input
            className="btn"
            type="submit"
            value="Delete Checked Collections"
            onClick={deleteCollections}
          />
        </div>
        <div>
          {resultMessage.map((result, index) => {
            return <p key={`message${index}`}>{result}</p>;
          })}
        </div>
      </form>
    </div>
  );
}

export default ManageCollections;
