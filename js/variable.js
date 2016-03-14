Variable = function(type, name)
{
    this.type = type;
    this.name = name;
};

Variable.prototype.to = function(target)
{
    var result = '';

    if (this.type != target && target != '' && target != 'number') {
        result += '('+target+')';
    }

    result += this.name;
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
