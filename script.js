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
    const searchButton = document.getElementById('search-button');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        sections.forEach(section => {
            const listElement = document.getElementById(section.id);
            const recipes = listElement.querySelectorAll('li');

            recipes.forEach(recipe => {
                const recipeName = recipe.textContent.toLowerCase();
                const recipeIngredients = recipe.dataset.ingredients ? recipe.dataset.ingredients.toLowerCase() : '';

                if (recipeName.includes(query) || recipeIngredients.includes(query)) {
                    recipe.style.display = 'list-item';
                } else {
                    recipe.style.display = 'none';
                }
            });
        });
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        sections.forEach(section => {
            const listElement = document.getElementById(section.id);
            const recipes = listElement.querySelectorAll('li');

            recipes.forEach(recipe => {
                const recipeName = recipe.textContent.toLowerCase();
                const recipeIngredients = recipe.dataset.ingredients ? recipe.dataset.ingredients.toLowerCase() : '';

                if (recipeName.includes(query) || recipeIngredients.includes(query)) {
                    recipe.style.display = 'list-item';
                } else {
                    recipe.style.display = 'none';
                }
            });
        });
    });

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
                        recipeItem.dataset.ingredients = recipe.ingredients.join(',');
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
        recipeSteps.innerHTML = recipe.steps.map(step => `<li>${step}</li>`).join(''); // Ensure no extra numbering
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