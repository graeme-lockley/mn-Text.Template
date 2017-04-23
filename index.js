const Result = mrequire("core:Data.Result:1.0.0");


const templateRE = /<%([^%>]+)?%>/g;


//= compile :: String -> Result Error Template
const compile = template => {

    const formatExpression = text => 'r.push(' + text + ');\n';

    const formatLiteral = text =>
        (text === '')
            ? ""
            : 'r.push("' + text.replace(/"/g, '\\"') + '");\n';

    let code = 'var r=[];\n';
    template.split('\n').forEach(line => {
        if (line.startsWith(">")) {
            code += line.substr(1) + '\n'
        } else {
            let cursor = 0;
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

    console.log(code);

    return Result.Okay(Function(code));
};


//= apply :: String -> Type -> Result Error String
const apply = template => model => {
    try {
        return Result.Okay(compile(template).andThen(t => t.apply(model)));
    } catch (e) {
        return Result.Error(e.message);
    }
};


module.exports = {
    apply
};