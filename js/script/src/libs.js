function textEdit(handler) {
    return function () {
        let $this = $(this);
        let $input = $(`<input type='text'>`);
        $this.hide().after($input);
        $input.val($this.text()).addClass($this.attr('class')).focus();
        $input.on('change blur', changeEdit);

        function changeEdit() {
            let text = $input.val();
            if (text === ''){
                text = '_';
            }
            $this.show().text(text);
            $input.remove();
            handler($this, text);
        }
    }
}

export { textEdit }
