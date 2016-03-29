(function(){
    function include(file) {
        $('head').append('<script type="text/javascript" src="js/blocks/'+file+'"></script>');
    }
    
    blocks = new Blocks();

    // Loading blocks
    include('pins.js');
    include('logic.js');
    include('print.js');
    include('math.js');
    include('signal.js');
    include('time.js');
    include('loop.js');
    include('comment.js');

    // Types compatibilities
    blocks.types.addCompatibility('bool', 'int');
    blocks.types.addCompatibility('int', 'float');
    blocks.types.addCompatibility('number', 'float');
    blocks.types.addCompatibility('number', 'int');
    
    blocks.types.addCompatibility('int', 'all');
    blocks.types.addCompatibility('bool', 'all');
    blocks.types.addCompatibility('float', 'all');

    blocks.run('#blocks');
    blocks.load(scene);

    blocks.ready(function() {
	blocks.menu.addAction('Export', function(blocks) {
	    alert($.toJSON(blocks.export()));
	}, 'export');
	
        blocks.menu.addAction('Clear', function(blocks) {
            blocks.clear();
	}, 'clear');
    });

    $('document').ready(function() {
        $('.generate').click(function() {
            var environment = new Environment();
            var generated = {};
            var process = function(block) {
                if (!generated[block.id]) {
                    generated[block.id] = true;
                    for (var k in block.edges) {
                        for (var n in block.edges[k]) {
                            var edge = block.edges[k][n];
                            if (edge.block2 == block) {
                                process(edge.block1);

                                environment.setEdgeValue(edge, 
                                        environment.getOutput(edge.block1, edge.connector1.name));
                            }
                        }
                    }

                    block.meta.generate(block, environment);
                }
            };
        
            for (var k in blocks.blocks) {
                var block = blocks.blocks[k];
                process(block);
            }

            $('textarea').val(environment.getCode());
            $('textarea').select();
        });
    });
})();
