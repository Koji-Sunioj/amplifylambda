import { API } from "aws-amplify";
import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const myAPI = "api1125d023";
  const path = "/items";

  useEffect(() => {
    getAllItems();
  }, []);

  function getAllItems() {
    API.get(myAPI, path)
      .then((response) => {
        setItems(response.Items);
        console.log(items);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function addItem(event) {
    event.preventDefault();
    const { name, description } = event.currentTarget;
    const init = {
      body: {
        name: name.value,
        description: description.value,
      },
    };

    API.put(myAPI, path, init)
      .then((response) => {
        getAllItems();
      })
      .catch((error) => {
        console.log("error");
      });
  }

  return (
    <div>
      <form
        type="submit"
        style={{ border: "1px solid black", padding: "20px" }}
        onSubmit={addItem}
      >
        <h3>add a new item</h3>
        <span
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
          }}
        >
          <div>
            <label>name: </label>
            <input
              type="text"
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
              name="name"
            ></input>
          </div>
          <div>
            <label>description: </label>
            <input
              type="text"
              onChange={(e) => {
                setDescription(e.currentTarget.value);
              }}
              name="description"
            ></input>
          </div>
        </span>
        <button disabled={name.length === 0 || description.length === 0}>
          Go
        </button>
      </form>
      {items.length > 0 &&
        items.map((item) => {
          return (
            <div
              style={{ border: "1px solid black", padding: "20px" }}
              key={item.id}
            >
              <strong>
                <p>{item.name}</p>
              </strong>
              <p>{item.description}</p>
              <p>{item.createdAt}</p>
            </div>
          );
        })}
    </div>
  );
}
export default App;
