const Result = mrequire("core:Data.Result:1.0.0");


//= compile :: String -> Result Error Template
const compile = template => {
    const re = /<%([^%>]+)?%>/g;
    let code = 'var r=[];\n';
    const add = function (line, js) {
        js
            ? (code += 'r.push(' + line + ');\n')
            : (code += line === '' ? '' : 'r.push("' + line.replace(/"/g, '\\"') + '");\n');
        return add;
    };
    const lines = template.split('\n');
    for (const lineIndex in lines) {
        let line = lines[lineIndex];
        if (line.startsWith(">")) {
            code += line.substr(1) + '\n'
        } else {
            let cursor = 0;
            re.lastIndex = 0;
            let match;
            while (match = re.exec(line)) {
                add(line.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
            }
            add(line.substr(cursor, line.length - cursor), false);
        }
    }
    code += 'return r.join("");';

    return Result.Okay(Function(code));
};


//= apply :: String -> Type -> Result Error String
const apply = template => model =>
    Result.Okay(compile(template).andThen(t => t.apply(model)));


module.exports = {
    apply
};