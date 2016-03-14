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
