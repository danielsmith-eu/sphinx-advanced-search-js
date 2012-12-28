var SphinxAdvSearch = function(config){
    var sphinx = this;

    this.config = config;
    this.el = config.el;
    this.draw();
    this.el.find(".sphinx_submit button").click(function(){
        sphinx.submit();
    });
}

SphinxAdvSearch.prototype = {
    remove_button_html: "X",
    remove_button_html_disabled: " ",
    submit: function(){
        // submit has been called, generate a query string and pass to the callback
        var sphinx = this;

        var query_string = "";
        jQuery.each(sphinx.el.find(".sphinx_field"), function(){
            var field = jQuery(this);
            var field_query = field.find(".sphinx_field_query").val();

            if (field_query == ""){
                return;
            }

            var fieldname = field.find(".sphinx_field_dropdown select").val();
            query_string += "(";
            if (fieldname != "_all_"){
                query_string += "@"+fieldname+" ";
            }
            query_string += field_query;
            query_string += ") ";
        });

        if (query_string != ""){
            sphinx.config.submit(query_string);
        }
    },
    draw: function(){
        // draw the interface onto the page
        var sphinx = this;

        var template = jQuery("#sphinx_template").html();

        sphinx.el.html(template);
        sphinx.el.addClass("sphinx_search");

        var field_html = sphinx.new_field();
        sphinx.el.find(".sphinx_fields").append(field_html);
        sphinx.set_remove_html();
    },
    field_list: function(){
        // generate the field list of "<option>" elements for the dropdown
        var sphinx = this;

        var options = "<option selected='selected' value='_all_'>"+sphinx.config.all_label+"</option>";
        options += "<option disabled='disabled'>--</option>";
        jQuery.each(sphinx.config.fields, function(field, label){
            options += "<option value='"+field+"'>"+label+"</option>";
        });
        return options;
    },
    field_count: function(){
        // return the current number of fields
        var sphinx = this;
        return sphinx.el.find(".sphinx_field").length;
    },
    add_button: function(){
        // generate a new DOM object for the "Add" button
        var sphinx = this;

        var button = jQuery("<div class='sphinx_field_add'>Add</div>");
        button.click(function(){
            // "Add" clicked
            sphinx.el.find(".sphinx_fields").append(sphinx.new_field());
            sphinx.set_remove_html();
            button.remove();
        });
        return button;
    },
    set_remove_html: function(){
        // set the html of the "X" buttons, or empty them if there is only one field shown
        var sphinx = this;

        if (sphinx.field_count() > 1){
            sphinx.el.find(".sphinx_field_remove").html(sphinx.remove_button_html);
        } else {
            sphinx.el.find(".sphinx_field_remove").html(sphinx.remove_button_html_disabled);
        }
    },
    new_field: function(field, label){
        // generate a DOM object for a new field
        var sphinx = this;

        var field_template = jQuery("#sphinx_field_template").html();
        field_template = jQuery(field_template);
        field_template.find(".sphinx_field_dropdown > select").html(sphinx.field_list());

        // add "Add" button to this field
        field_template.append(sphinx.add_button());

        field_template.find(".sphinx_field_remove").click(function(){
            // "Remove" clicked
            if (sphinx.el.find(".sphinx_fields").children().length < 2){
                return false;
            }
            field_template.remove();
            if (sphinx.el.find(".sphinx_field_add").length < 1){
                // need to add a new "Add" button to the last field
                sphinx.el.find(".sphinx_field").last().append(sphinx.add_button());
            }
            sphinx.set_remove_html();
        });

        return field_template;
    },
}
