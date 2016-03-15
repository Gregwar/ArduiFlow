Variable = function(type, name, defaultValue)
{
    this.ref = false;
    this.local = true;
    this.type = type;
    this.name = name;
    this.defaultValue = defaultValue;
};

Variable.prototype.to = function(target)
{
    var result = '';

    if (this.type != target && target != '' && target != 'number') {
        result += '('+target+')';
    }

    result += '('+this.name+')';
    return result;
};

Variable.prototype.codeType = function()
{
    if (this.type == 'number') return 'float';

    return this.type;
};

Variable.prototype.toString = function()
{
    return this.name;
};
