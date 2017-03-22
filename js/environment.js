Environment = function()
{
    // XXX: This should be configurable
    this.baudrate = 115200;
    this.frequency = 100;
    this.loop = '';
    this.setup = '';
    this.variables = {};
    this.edgeValues = {};
};

Environment.prototype.getCode = function()
{
    var code = '';

    for (var k in this.variables) {
        var variable = this.variables[k];
        if (variable.name == k) {
            code += variable.codeType()+' '+variable.name+';\n';
        }
    }
    code += '\n';
    
    code += 'void setup() {\n';
    code += 'Serial.begin('+this.frequency+');\n';
    code += this.setup;
    
    for (var k in this.variables) {
        var variable = this.variables[k];
        if (variable.name == k && variable.defaultValue != undefined) {
            code += variable.name + ' = ' + variable.defaultValue+';\n';
        }
    }

    code += '};\n';
    code += '\n';
    
    code += 'void tick() {\n';
    code += '\n';
    code += this.loop;
    code += '};\n';
    code += '\n';

    code += 'void loop() {\n';
    code += 'unsigned long int t;\n';
    code += 'while (1) {\n';
    code += 't = millis();\n';
    code += 'tick();\n'
    code += 'while ((millis()-t) < '+Math.round(1000/this.frequency)+');\n';
    code += '}\n';
    code += '}\n';

    return code;
};

Environment.prototype.getType = function(type)
{
    if (type == 'int' || type =='integer') return 'int';    
    if (type == 'float') return 'float';
    if (type == 'bool' || type == 'boolean') return 'bool';

    return type;
};

Environment.prototype.getVariable = function(block, vname, type, defaultValue)
{
    var name = 'variable_'+block.id+'_'+vname;
    if (!(name in this.variables)) {
        this.variables[name] = new Variable(type, name, defaultValue);
        this.variables[name].local = false;
    }

    return this.variables[name];
};

Environment.prototype.getOutput = function(block, fieldName, index)
{
    var field = block.fields.getField(fieldName);
    if (field == null) {
        throw "Unknown field "+fieldName;
    }
    if (field.isArray) {
        var outputs = {};
        for (var k=0; k<field.getDimension(block.fields); k++) {
            var type = this.getType(field.type);
            var name = 'field_'+block.id+'_'+field.name+'_'+k;

            if (!(name in this.variables)) {
                this.variables[name] = new Variable(type, name, field.value);
            }
            outputs[''+k] =  this.variables[name];
        }
        if (index != undefined) {
            return outputs[index];
        } else {
            return outputs;
        }
    } else {
        var type = this.getType(field.type);
        var name = 'field_'+block.id+'_'+field.name;

        if (!(name in this.variables)) {
            this.variables[name] = new Variable(type, name, field.value);
        }

        return this.variables[name];
    }
};

Environment.prototype.isInt = function(value)
{
    if (typeof(value) == 'string') {
        if (value.indexOf('.') != -1) return false;
    }
    return (Math.abs(Math.round(value)-value) < 1e-6);
};

Environment.prototype.getConstant = function(value)
{
    if (this.isInt(value)) {
        return new Variable('int', Math.round(value));
    } else {
        return new Variable('float', value);
    }
};

Environment.prototype.setOutput = function(block, fieldName, variable)
{
    var field = block.fields.getField(fieldName);
    var name = 'field_'+block.id+'_'+field.name;
    this.variables[name] = variable;
};

Environment.prototype.setEdgeValue = function(edge)
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

        this.edgeValues[key][edge.connector2.index] = edge;
    } else {
        if (field.card[1] != 1) {
            // This is an * input
            if (!(key in this.edgeValues)) {
                this.edgeValues[key] = [];
            }
           
            this.edgeValues[key].push(edge);
        } else {
            if (!(key in this.edgeValues)) {
                this.edgeValues[key] = edge;
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
        var edge = this.edgeValues[key];
        if (!(edge instanceof Edge)) {
            for (k in edge) {
                var e = edge[k];
                edge[k] = this.getOutput(e.block1, e.connector1.name, e.connector1.index);
            }
            return edge;
        } else {
            return this.getOutput(edge.block1, edge.connector1.name, edge.connector1.index);
        }
    } else {
        var field = block.fields.getField(name);
        return this.getConstant(field.value);
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
                    var edges = this.edgeValues[key];

                    if (edges instanceof Array || edges instanceof Object) {
                        for (var x in edges) {
                            var edge = edges[x];
                            var value = this.getOutput(edge.block1, edge.connector1.name, edge.connector1.index);
                            if (value.type != 'int') return 'number';
                        }
                    } else {
                        var edge = edges;
                        var value = this.getOutput(edge.block1, edge.connector1.name, edge.connector1.index);
                        if (value.type != 'int') return 'number';
                    }
                }
            }
        }
    }

    return 'int';
};
