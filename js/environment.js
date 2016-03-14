Environment = function()
{
    this.loop = '';
    this.setup = '';
    this.variables = {};
    this.edgeValues = {};
};

Environment.prototype.getCode = function()
{
    var code = '';
    
    code += 'void setup() {\n';
    code += this.setup;
    code += '};\n';
    code += '\n';
    
    code += 'void loop() {\n';
    for (var k in this.variables) {
        var variable = this.variables[k];
        code += variable.codeType()+' '+variable.name+';\n';
    }
    code += '\n';
    code += this.loop;
    code += '};\n';
    code += '\n';

    return code;
};

Environment.prototype.getType = function(type)
{
    if (type == 'int' || type =='integer') return 'int';    
    if (type == 'float') return 'float';
    if (type == 'bool' || type == 'boolean') return 'bool';

    return type;
};

Environment.prototype.getFieldVariable = function(block, fieldName)
{
    var field = block.fields.getField(fieldName);
    if (field == null) {
        throw "Unknown field "+fieldName;
    }
    var type = this.getType(field.type);
    var name = 'field_'+block.id+'_'+field.name;

    if (!(name in this.variables)) {
        this.variables[name] = new Variable(type, name);
    }

    return this.variables[name];
};

Environment.prototype.setEdgeValue = function(edge, variable)
{
    var block = edge.block2;
    var name = edge.connector2.name;
    var key = block.id+'/'+name.toLowerCase();
    var field = block.fields.getField(name);

    if (field.isArray) {
        // The field is an array
        if (!(key in this.edgeValues)) {
            this.edgeValues[key] = {};
        }

        this.edgeValues[key][edge.connector2.index] = variable;
    } else {
        if (field.card[1] != 1) {
            // This is an * input
            if (!(key in this.edgeValues)) {
                this.edgeValues[key] = [];
            }
           
            this.edgeValues[key].push(variable);
        } else {
            if (!(key in this.edgeValues)) {
                this.edgeValues[key] = variable;
            }
        }
    }
};

Environment.prototype.hasInput = function(block)
{
    for (var k=1; k<arguments.length; k++) {
        var key = block.id+'/'+arguments[k].toLowerCase();
        if (!(key in this.edgeValues)) {
            return false;
        }
    }
    
    return true;
};

Environment.prototype.getInput = function(block, name)
{
    var key = block.id+'/'+name.toLowerCase();

    if (key in this.edgeValues) {
        return this.edgeValues[key];
    } else {
        return null;
    }
};

Environment.prototype.guessType = function(block)
{
    for (var k in block.edges) {
        for (var n in block.edges[k]) {
            var edge = block.edges[k][n];
            if (edge.block2 == block) {
                var key = block.id+'/'+edge.connector2.name.toLowerCase();
                if (key in this.edgeValues) {
                    var values = this.edgeValues[key];

                    if (values instanceof Array || values instanceof Object) {
                        for (var x in values) {
                            if (values[x].type != 'int') return 'number';
                        }
                    } else {
                        if (values.type != 'int') return 'number';
                    }
                }
            }
        }
    }

    return 'int';
};
