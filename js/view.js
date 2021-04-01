// ОТОБРАЖЕНИЕ ДАННЫХ

window.View = {
    render(templateName, model) {
        templateName = templateName + 'Template';

        const templateElement = document.querySelector(templateName).textContent
        const renderFn = Handlebars.compile(templateElement);
        return renderFn(model);

    }
}

