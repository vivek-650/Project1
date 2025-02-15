import { useState } from "react";

const AddRecepies = () => {
  const [recpie, setRecpie] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    explanation: "",
  });

  const addRecpie = async () => {
    try {
      const recpieData = { ...recpie, email: "user@example.com" };
      // console.log("Recpie data: ", recpieData);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/add-recipe`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(recpieData),
        }
      );
      // console.log("Response of add recpie api: ", response);
      if (response.ok) {
        const data = await response.json();
        // console.log("Add Recpie data: ", data);
        alert(data.message);
      } else {
        console.log("Error in add recpie api");
      }
    } catch (error) {
      console.log("Error in Add Recpie api: ", error);
    }
  };

  const handleAddRecpie = () => {
    addRecpie();
    setRecpie({
      title: "",
      ingredients: [],
      instructions: "",
      explanation: "",
    });
  };
  return (
    <div>
      <h1>Add Recpies</h1>
      <hr />
      <div>
        <form action="">
          <label htmlFor="title">
            Title:
            <input
              type="text"
              name="title"
              value={recpie.title}
              onChange={(e) => setRecpie({ ...recpie, title: e.target.value })}
            />
          </label>
          <br />
          <label htmlFor="ingredients">
            Ingredients:
            <input
              type="text"
              name="ingredients"
              value={recpie.ingredients.join(", ")}
              onChange={(e) =>
                setRecpie({
                  ...recpie,
                  ingredients: e.target.value.split(", "),
                })
              }
            />
          </label>
          <br />
          <label htmlFor="instructions">
            Instructions:
            <textarea
              name="instructions"
              value={recpie.instructions}
              onChange={(e) =>
                setRecpie({ ...recpie, instructions: e.target.value })
              }
            />
          </label>
          <br />
          <label htmlFor="explanation">
            Explanation:
            <textarea
              name="explanation"
              value={recpie.explanation}
              onChange={(e) =>
                setRecpie({ ...recpie, explanation: e.target.value })
              }
            />
          </label>
          <br />
          <button type="button" onClick={handleAddRecpie}>
            Add Recpie
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecepies;
