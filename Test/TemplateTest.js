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
