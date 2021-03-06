const Result = mrequire("core:Data.Result:1.0.0");


const templateRE = /<%(.+?)%>/g;



//= toJavaScript :: String -> Result String String
const toJavaScript = template => {
    const formatExpression = text => 'r.push(' + text.trim() + ');\n';

    const formatLiteral = text =>
        (text === '')
            ? ""
            : 'r.push("' + text.replace(/"/g, '\\"') + '");\n';

    let code = 'var r=[];\n';
    template.split('\n').forEach((line, index) => {
        if (line.startsWith(">")) {
            code += line.substr(1) + '\n'
        } else {
            let cursor = 0;
            if (line.startsWith("+")) {
                cursor = 1;
            } else if (index > 0) {
                code += 'r.push("\\n");\n';
            }
            templateRE.lastIndex = 0;
            let match;
            while (match = templateRE.exec(line)) {
                code += formatLiteral(line.slice(cursor, match.index));
                code += formatExpression(match[1]);
                cursor = match.index + match[0].length;
            }
            code += formatLiteral(line.substr(cursor, line.length - cursor));
        }
    });
    code += 'return r.join("");';

    return Result.Okay(code);
};


//= compile :: String -> Result Error Template
const compile = template => {
    return toJavaScript(template).andThen(js => Result.Okay(Function(js)));
};


//= apply :: String -> Type -> Result Error String
const apply = template => model => {
    try {
        return compile(template).andThen(t => Result.Okay(t.apply(model)));
    } catch (e) {
        return Result.Error(e.message);
    }
};


module.exports = {
    apply,
    compile,
    toJavaScript
};