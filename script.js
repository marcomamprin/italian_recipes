document.addEventListener('DOMContentLoaded', () => {
    const sections = [
        { id: 'recipes', file: './json/main_courses.json' },
        { id: 'appetizers', file: './json/appetizers.json' },
        { id: 'soups', file: './json/soups.json' },
        { id: 'salads', file: './json/salads.json' },
        { id: 'sides', file: './json/sides.json' },
        { id: 'desserts', file: './json/desserts.json' },
        { id: 'beverages', file: './json/beverages.json' }
    ];

    const recipeDetails = document.getElementById('recipe-details');
    const backButton = document.getElementById('back-button');
    const recipeName = document.getElementById('recipe-name');
    const recipeIngredients = document.getElementById('recipe-ingredients');
    const recipeSteps = document.getElementById('recipe-steps');

    sections.forEach(section => {
        const listElement = document.getElementById(section.id);
        const sectionElement = listElement.closest('section');

        // Dynamically set the section title based on the filename
        const title = section.file.split('/').pop().replace('.json', '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        sectionElement.querySelector('h2').textContent = title;

        fetch(section.file)
            .then(response => response.json())
            .then(data => {
                if (!data.recipes || data.recipes.length === 0) {
                    sectionElement.style.display = 'none';
                } else {
                    data.recipes.forEach(recipe => {
                        const recipeItem = document.createElement('li');
                        const recipeLink = document.createElement('a');
                        recipeLink.href = '#';
                        recipeLink.textContent = recipe.name;
                        recipeLink.addEventListener('click', () => {
                            showRecipeDetails(recipe);
                        });
                        recipeItem.appendChild(recipeLink);
                        listElement.appendChild(recipeItem);
                    });
                }
            })
            .catch(error => {
                console.error(`Error loading ${section.file}:`, error);
                sectionElement.style.display = 'none';
            });
    });

    backButton.addEventListener('click', () => {
        recipeDetails.style.display = 'none';
        sections.forEach(section => {
            const listElement = document.getElementById(section.id);
            const sectionElement = listElement.closest('section');

            // Check if the section should remain hidden
            if (listElement.children.length === 0) {
                sectionElement.style.display = 'none';
            } else {
                sectionElement.style.display = 'block';
            }
        });
    });

    function showRecipeDetails(recipe) {
        document.querySelectorAll('section ul').forEach(ul => ul.parentElement.style.display = 'none');
        recipeDetails.style.display = 'block';
        recipeName.textContent = recipe.name;
        recipeIngredients.innerHTML = recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
        recipeSteps.innerHTML = recipe.steps.map((step, index) => `<li>${index + 1}. ${step}</li>`).join('');
    }
});