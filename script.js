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

    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    const searchInput = document.getElementById('search-input');
    const resetButton = document.getElementById('reset-button');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        sections.forEach(section => {
            const listElement = document.getElementById(section.id);
            const sectionElement = listElement.closest('section');
            const recipes = listElement.querySelectorAll('li');

            let hasVisibleRecipes = false;

            recipes.forEach(recipe => {
                const recipeName = recipe.textContent.toLowerCase();
                const recipeIngredients = recipe.dataset.ingredients ? recipe.dataset.ingredients.toLowerCase() : '';

                if (recipeName.includes(query) || recipeIngredients.includes(query)) {
                    recipe.style.display = 'list-item';
                    hasVisibleRecipes = true;
                } else {
                    recipe.style.display = 'none';
                }
            });

            // Hide the section if no recipes are visible
            sectionElement.style.display = hasVisibleRecipes ? 'block' : 'none';
        });
    });

    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        sections.forEach(section => {
            const listElement = document.getElementById(section.id);
            const recipes = listElement.querySelectorAll('li');

            recipes.forEach(recipe => {
                recipe.style.display = 'list-item';
            });
        });
    });

    const randomizeButton = document.getElementById('randomize-button');

    randomizeButton.addEventListener('click', () => {
        const allRecipes = [];
        sections.forEach(section => {
            const listElement = document.getElementById(section.id);
            const recipes = listElement.querySelectorAll('li');
            recipes.forEach(recipe => {
                const recipeData = {
                    name: recipe.textContent,
                    ingredients: recipe.dataset.ingredients ? recipe.dataset.ingredients.split(',') : [],
                    steps: recipe.dataset.steps ? JSON.parse(recipe.dataset.steps) : [],
                    author: recipe.dataset.author ? recipe.dataset.author.split(',') : [],
                    notes: recipe.dataset.notes ? recipe.dataset.notes.split(',') : [],
                    wine: recipe.dataset.wine ? recipe.dataset.wine.split(',') : [],
                    nutritional_infos: recipe.dataset.nutritional_infos ? recipe.dataset.nutritional_infos.split(',') : []
                };
                allRecipes.push(recipeData);
            });
        });

        if (allRecipes.length > 0) {
            const randomRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
            showRecipeDetails(randomRecipe);
        }
    });

    sections.forEach(section => {
        const listElement = document.getElementById(section.id);
        const sectionElement = listElement.closest('section');

        // Dynamically set the section title based on the filename
        const title = section.file.split('/').pop().replace('.json', '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        const italianTitles = {
            "main courses": "Primi Piatti",
            "appetizers": "Antipasti",
            "soups": "Zuppe",
            "salads": "Insalate",
            "sides": "Contorni",
            "desserts": "Dolci",
            "beverages": "Bevande"
        };
        sectionElement.querySelector('h2').textContent = `${title} (${italianTitles[title.toLowerCase()] || ''})`;

        fetch(section.file)
            .then(response => response.json())
            .then(data => {
                if (!data.recipes || data.recipes.length === 0) {
                    sectionElement.style.display = 'none';
                } else {
                    // Sort recipes alphabetically by name
                    data.recipes.sort((a, b) => a.name.localeCompare(b.name));

                    data.recipes.forEach(recipe => {
                        const recipeItem = document.createElement('li');
                        recipeItem.classList.add('recipe-item');

                        const recipeLink = document.createElement('a');
                        recipeLink.href = '#';
                        recipeLink.textContent = recipe.name;
                        recipeLink.addEventListener('click', () => {
                            showRecipeDetails(recipe);
                        });

                        recipeItem.appendChild(recipeLink);

                        if (recipe.link_picture && recipe.link_picture[0]) {
                            const recipeImage = document.createElement('img');
                            recipeImage.src = recipe.link_picture[0];
                            recipeImage.alt = `${recipe.name} photo`;
                            recipeItem.appendChild(recipeImage);
                        }

                        recipeItem.dataset.ingredients = recipe.ingredients.join(',');
                        recipeItem.dataset.steps = JSON.stringify(recipe.steps);
                        recipeItem.dataset.author = recipe.author ? recipe.author.join(',') : '';
                        recipeItem.dataset.notes = recipe.notes ? recipe.notes.join(',') : '';
                        recipeItem.dataset.wine = recipe.wine ? recipe.wine.join(',') : '';
                        recipeItem.dataset.nutritional_infos = recipe.nutritional_infos ? recipe.nutritional_infos.join(',') : '';

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
        recipeSteps.innerHTML = recipe.steps.map(step => `<li>${step}</li>`).join('');

        // Clear previous additional details
        const additionalDetails = document.getElementById('recipe-additional-details');
        additionalDetails.innerHTML = '';

        if (recipe.link_picture && recipe.link_picture[0]) {
            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.link_picture[0];
            recipeImage.alt = `${recipe.name} photo`;
            recipeImage.style.maxWidth = '300px';
            recipeImage.style.marginBottom = '10px';
            additionalDetails.appendChild(recipeImage);
        }

        // Add author, notes, wine, and nutritional information
        if (recipe.author) {
            additionalDetails.insertAdjacentHTML('beforeend', `<p><strong>Author:</strong> ${recipe.author.join(', ')}</p>`);
        }
        if (recipe.notes) {
            additionalDetails.insertAdjacentHTML('beforeend', `<p><strong>Notes:</strong> ${recipe.notes.join(', ')}</p>`);
        }
        if (recipe.wine) {
            additionalDetails.insertAdjacentHTML('beforeend', `<p><strong>Wine Pairing:</strong> ${recipe.wine.join(', ')}</p>`);
        }
        if (recipe.nutritional_infos) {
            additionalDetails.insertAdjacentHTML('beforeend', `<p><strong>Nutritional Info:</strong> ${recipe.nutritional_infos.join(', ')}</p>`);
        }
    }

    // Commented out translation functionality
    // const translationContainer = document.getElementById('translation-container');
    // const languageSelect = document.getElementById('language-select');
    // const translateButton = document.getElementById('translate-button');

    // translateButton.addEventListener('click', () => {
    //     const selectedLanguage = languageSelect.value;
    //     console.log(`Translation to ${selectedLanguage} is currently inactive.`);
    // });
});