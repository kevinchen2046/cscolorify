## cscolorify
color block of the browser's console.

![image](https://kevinchen2046.github.io/assets/images/cscolorify.png)

### use
```html
    <script src="https://cdn.jsdelivr.net/npm/cscolorify" type="text/javascript"></script>
```

### supported:
- colorify
    - log - grey
    - info -green
    - warn -orange
    - debug -blue
    - error -red
    - table -purple
    - count - blue
    - countReset - 
    - assert - param1 could be expression
- new method
    - style(...{ text: string, bgcolor?: number, color?: number, size?: number, bold?: boolean }[]) - custom
    - disable() - disable all printf