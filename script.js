fetch('./recipes.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
            const recipeList = document.getElementById('recipes');
            data.recipes.forEach(recipe => {
                        const recipeItem = document.createElement('li');
                        recipeItem.innerHTML = `
                <h3>${recipe.name}</h3>
                <p><strong>Ingredients:</strong></p>
                <ul class='ingredients-list' style='margin: 0; padding: 0;'>${recipe.ingredients.map(ingredient => `<li style='display: block;'>${ingredient}</li>`).join('')}</ul>
                <p><strong>Steps:</strong></p>
                <ol style='margin: 0; padding: 0;'>${recipe.steps.map(step => `<li style='display: block;'>${step}</li>`).join('')}</ol>
                <hr>
            `;
            recipeList.appendChild(recipeItem);
        });
    })
    .catch(error => console.error('Error loading recipes:', error));