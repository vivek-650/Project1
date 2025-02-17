import { useEffect, useState } from "react";

const AddRecepies = () => {
  const [recpie, setRecpie] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    explanation: "",
  });

  const recipeCount = sessionStorage.getItem("recipeCount");
  // const email = sessionStorage.getItem("email");
  const [recpies, setRecpies] = useState(
    Array.from({ length: recipeCount }, () => ({
      title: "",
      ingredients: [],
      instructions: "",
      explanation: "",
    }))
  );

  const addRecpie = async () => {
    try {
      const recpieData = { ...recpies, email: "user@example.com" };
      console.log("Recpie data: ", recpieData);
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
      <h1>Add Recipes</h1>
      <hr />
      <div>
        {recpies.map((item, index) => (
          <form key={index} action="">
            <label htmlFor={`title-${index}`}>
              Title:
              <input
                type="text"
                name={`title-${index}`}
                value={item.title}
                onChange={(e) =>
                  setRecpies(
                    recpies.map((rec, i) =>
                      i === index ? { ...rec, title: e.target.value } : rec
                    )
                  )
                }
              />
            </label>
            <br />
            <label htmlFor={`ingredients-${index}`}>
              Ingredients:
              <input
                type="text"
                name={`ingredients-${index}`}
                value={item.ingredients.join(", ")}
                onChange={(e) =>
                  setRecpies(
                    recpies.map((rec, i) =>
                      i === index
                        ? { ...rec, ingredients: e.target.value.split(", ") }
                        : rec
                    )
                  )
                }
              />
            </label>
            <br />
            <label htmlFor={`instructions-${index}`}>
              Instructions:
              <textarea
                name={`instructions-${index}`}
                value={item.instructions}
                onChange={(e) =>
                  setRecpies(
                    recpies.map((rec, i) =>
                      i === index ? { ...rec, instructions: e.target.value } : rec
                    )
                  )
                }
              />
            </label>
            <br />
            <label htmlFor={`explanation-${index}`}>
              Explanation:
              <textarea
                name={`explanation-${index}`}
                value={item.explanation}
                onChange={(e) =>
                  setRecpies(
                    recpies.map((rec, i) =>
                      i === index ? { ...rec, explanation: e.target.value } : rec
                    )
                  )
                }
              />
            </label>
            <br />
          </form>
        ))}
        <button type="button" onClick={handleAddRecpie}>
          Add Recipe
        </button>
      </div>
    </div>
  );
};

export default AddRecepies;
