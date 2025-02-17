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

  const styles = {
    container: {
      width: "95%",
      height: "10vh",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      textAlign: "center",
      color: "#333",
    },
    formContainer: {
      // backgroundColor: "red",
      padding: "40px",
      borderRadius: "8px",
      // boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "0px",
      color: "#555",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginBottom: "0px",
      width: "100%",
    },
    textarea: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginBottom: "0px",
      width: "100%",
      height: "100px",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#28a745",
      color: "#fff",
      cursor: "pointer",
      alignSelf: "center",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Add Recipes</h1>
      {/* <hr /> */}
      <div style={styles.formContainer}>
        <form style={styles.form}>
          <label htmlFor="title" style={styles.label}>
            Title:
            <input
              type="text"
              name="title"
              value={recpie.title}
              onChange={(e) => setRecpie({ ...recpie, title: e.target.value })}
              style={styles.input}
            />
          </label>
          <br />
          <label htmlFor="ingredients" style={styles.label}>
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
              style={styles.input}
            />
          </label>
          <br />
          <label htmlFor="instructions" style={styles.label}>
            Instructions:
            <textarea
              name="instructions"
              value={recpie.instructions}
              onChange={(e) =>
                setRecpie({ ...recpie, instructions: e.target.value })
              }
              style={styles.textarea}
            />
          </label>
          <br />
          <label htmlFor="explanation" style={styles.label}>
            Explanation:
            <textarea
              name="explanation"
              value={recpie.explanation}
              onChange={(e) =>
                setRecpie({ ...recpie, explanation: e.target.value })
              }
              style={styles.textarea}
            />
          </label>
          <br />
          <button type="button" onClick={handleAddRecpie} style={styles.button}>
            Add Recipe
          </button>
        </form>
      </div>
    </div>
  );


};

export default AddRecepies;
