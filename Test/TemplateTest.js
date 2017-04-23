const Assert = require("assert");
const FileSystem = mrequire("core:System.IO.Native.FileSystem:1.0.0");
const Result = mrequire("core:Data.Result:1.0.0");
const Unit = mrequire("core:Test.Unit:v1.0.0");


const Template = require("../index");

const TEMPLATE_TEST_DATA = {
    skills: ["js", "html", "css"],
    dots: ['.', '.', '.'],
    showSkills: true
};


const suite = Unit.newSuite("Text Template Suite");


Promise.all([
    FileSystem.readFile(__dirname + "/TemplateData/0001.input.txt"),
    FileSystem.readFile(__dirname + "/TemplateData/0001.output.txt")
]).then(output => {
    suite.case("given a text template with data will produce the expected result", () => {
        Assert.deepEqual(Template.apply(output[0])(TEMPLATE_TEST_DATA), Result.Okay(output[1]));
    });
});

FileSystem.readFile(__dirname + "/TemplateData/0002.input.txt")
    .then(output => {
        suite.case("given a text template with broken JavaScript will return an Result.Error", () => {
            Assert.deepEqual(Template.apply(output)(TEMPLATE_TEST_DATA), Result.Error("Unexpected token {"));
        });
    });

Promise.all([
    FileSystem.readFile(__dirname + "/TemplateData/0003.input.txt"),
    FileSystem.readFile(__dirname + "/TemplateData/0003.output.txt")
]).then(output => {
    suite.case("a text template is able to reference modules provided they are included in the state", () => {
        const testData = {
            Result: Result
        };
        Assert.deepEqual(Template.apply(output[0])(testData), Result.Okay(output[1]));
    });
});

