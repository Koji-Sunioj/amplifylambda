import { API } from "aws-amplify";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const response = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const myAPI = "api1125d023";
  const path = "/items";

  useEffect(() => {
    getAllItems();
    if (items.length > 0) fadeIn();
    {
      setMessage("successfully loaded");
      fadeIn();
    }
  }, []);

  function fadeIn() {
    response.current.className = "fade-in";
    setTimeout(() => {
      response.current.className = "";
    }, 2000);
  }

  async function getAllItems() {
    await API.get(myAPI, path)
      .then((response) => {
        response.Items.sort((first, second) => {
          return new Date(first.createdAt) - new Date(second.createdAt);
        });
        setItems(response.Items);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function addItem(event) {
    event.preventDefault();
    const { name, description } = event.currentTarget;
    setName("");
    setDescription("");
    const init = {
      body: {
        id: uuidv4(),
        name: name.value,
        description: description.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __typename: "Todo",
      },
    };
    setLoading(true);
    await API.put(myAPI, path, init)
      .then((response) => {
        getAllItems();
        setMessage(response.message);
      })
      .catch((error) => {
        console.log("error");
      });
    fadeIn();
  }

  async function deleteItem(id) {
    setLoading(true);
    await API.del(myAPI, path, { body: { id: id } })
      .then((response) => {
        getAllItems();
        setMessage(response.message);
      })
      .catch((error) => {
        console.log("error");
      });
    fadeIn();
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          border: "1px solid black",
          padding: "20px",
          flex: "1",
          margin: "20px",
        }}
      >
        <form type="submit" onSubmit={addItem} style={{ width: "50%" }}>
          <h3>add a new item</h3>
          <span
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
              height: "50px",
            }}
          >
            <div>
              <label style={{ width: "20%", display: "inline-block" }}>
                name:{" "}
              </label>
              <input
                value={name}
                type="text"
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
                name="name"
              ></input>
            </div>
            <div>
              <label style={{ width: "20%", display: "inline-block" }}>
                description:{" "}
              </label>
              <input
                value={description}
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
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p ref={response} className="">
            <strong>{message}</strong>
          </p>
        </div>
      </div>

      {items.length > 0 &&
        items.map((item) => {
          return (
            <div
              style={{
                border: "1px solid black",
                padding: "20px",
                margin: "20px",
              }}
              key={item.id}
            >
              <strong>
                <p>{item.name}</p>
              </strong>
              <p>{item.description}</p>
              <p>{item.createdAt}</p>
              <button
                onClick={() => {
                  deleteItem(item.id);
                }}
                disabled={loading}
              >
                delete
              </button>
            </div>
          );
        })}
    </div>
  );
}
export default App;
