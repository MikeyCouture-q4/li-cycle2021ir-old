/**
 * Reuseable functions used on Q4 Websites
 * @class q4.app
 */

//  IE11 forEach Polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

/** @lends q4.app */
var q4Defaults = {
    options: {
        /**
         * Scroll speed for `scrollTo`
         */
        scrollSpeed: 1000,
        /**
         * Offset used with the `scrollTo` method to account for fixed headers
         */
        headerOffset: function () {
            return 0;
        },
        /**
         * Any mailing list with this class will have their validation overwritten
         */
        mailingListSignupCls: '.module-subscribe--fancy',
        /**
         * Error message to display (i.e. mailing list signup / unsubscribe)
         */
        errorMessage: 'The following errors must be corrected',
        /**
         * Text to display if an item is required for validation
         */
        requiredText: 'is required',
        /**
         * Text to display if an entry is invalid and failed validation
         */
        invalidText: 'is invalid',
        /**
         * Text to display if captcha is required. `requiredText` and `invalidText` will often proceed this text (i.e Code is required)
         */
        captchaValidationText: 'Code',
        /**
         * Text used if a code is required.
         */
        provideCodeText: 'Please provide the code',
        /**
         * Custom template for email validation
         */
        errorTpl: (
            '<p class="module_message module_message--error">{{errorMessage}}</p>' +
            '<div>' +
            '   {{#errors}}' +
            '       <p class="module_message module_message--validation_error">&#8226; {{name}} {{message}}</p>' +
            '   {{/errors}}' +
            '</div>'
        ),
        mailingListConfig: {
            /**
             * Template to overwrite mailing list signup confirmation html.
             */
            tpl: (
                '<div id="SubscriberConfirmation" class="module module-subscribe module-subscribe--fancy dark grid_col grid_col--3-of-6 grid_col--md-1-of-2">' +
                '   <div class="module_container--outer">' +
                '       <h2 class="module_title">Email Alerts</h2>' +
                '       <div class="module_container--inner">' +
                '           <p class="module_message module_message--success"></p>' +
                '       </div>' +
                '   </div>' +
                '</div>'
            ),
            fancyOpts: {},
            hideOnConfirmation: '.module-subscribe-privacy',
            location: '.pane--footer',
            submitText: 'Submit' //this will change the text of the submit button on the on the mailing List
        },
        /**
         * Contrast function options
         */
        contrast: {
            toggle: '.module-contrast_button',
            toggleClass: 'js--active',
            bodyClass: 'js--contrast'
        },
        /**
         * Enable superfish plugin
         */
        superfish: true
    },

    /**
     * A test used to detect whether not the device satisfies a certain OS
     * @example if (app.isMobile.any()) { // If on a mobile device, execute code }
     */
    isMobile: {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function () {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
        }
    },

    // Default init function
    init: function () {
    },

    /**
     * Function than can be used to trim text or create expandable text upon click on another element.
     * @param {$selector} [selector]  the element which needs to be trimmed.
     * @param {maxChar} [number] number of characters to be trimmed
     * @param {moreText} [string] text for element that can be clicked to reveal the rest of the trimmed text. Defaults to 'show more'
     * @param {lessText} [string] text for element that can be clicked to hide the rest of the trimmed text. Defaults to 'show less'
     * @param {ellipsesText} [string] text used for ellipsis. Defaults to '...'
     * @example app.trim($('.selector'), 200);
     */
    trim: function ($selector, maxChar, moreText, lessText, ellipsesText) {
        maxChar = maxChar ? maxChar : 0;
        moreText = moreText ? '<span class="trimmed_more" tabindex="0">' + moreText + '</span>' : '<span class="trimmed_more" tabindex="0">show more</span>';
        lessText = lessText ? '<span class="trimmed_less js--hidden" tabindex="0">' + lessText + '</span>' : '<span class="trimmed_less js--hidden" tabindex="0">show less</span>';
        ellipsesText = ellipsesText ? '<span class="trimmed_ellipse">' + ellipsesText + '</span>' : '<span class="trimmed_ellipse">...</span>';

        $selector.each(function () {
            var $this = $(this),
                trimmedLength = $this.text().length,
                trimmedText = $this.text().substr(0, maxChar),
                trimmedEnd = $this.text().substr(maxChar - trimmedLength, trimmedLength);

            if (maxChar && trimmedLength > maxChar) {
                $this.html('<span class="trimmed"><span class="trimmed_short">' + trimmedText + '</span><span class="trimmed_end js--hidden">' + trimmedEnd + '</span>' + ellipsesText + moreText + lessText + '</span>');
            }
        });

        $selector.on('click keypress', '.trimmed_more, .trimmed_less', function (e) {
            if (e.keyCode == 13 || e.type == 'click') {
                $(this).toggleClass('js--trimmed');
                $(this).toggleClass('js--hidden').siblings('.trimmed_more, .trimmed_ellipse, .trimmed_less, .trimmed_end').toggleClass('js--hidden');
            }
        });
    },

    // Removes DOM elements on load
    cleanUp: function () {
        $('#lnkPostback').remove();
        $('#litPageDiv > a:first').remove();
    },

    // Easier preview navigation
    resetDate: function (selectors) {
        if (GetViewType() === "0") {
            $(selectors.join()).each(function () {
                $(this).attr('href', $(this).attr('href') + '&ResetDate=1');
            });
        }
    },

    // A better Preview Toolbar
    previewToolbar: function () {
        if (GetViewType() === "0") {
            $('.PreviewToolBar').prepend(
                '<div class="PreviewTrigger">' +
                '<i class="q4-icon_clock-line"></i>' +
                '</div>'
            ).on('click', '.PreviewTrigger', function () {
                $(this).toggleClass('js--active').parent().toggleClass('js--open');
            });
        }
    },

    /**
     * Function for contrast class toggle on body element. Also stores cookie
     * @example app.contrast.init();
     */
    contrast: {
        getCookie: function () {
            return document.cookie.replace(/(?:(?:^|.*;\s*)contrast\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        },
        setCookie: function (boolean) {
            document.cookie = 'contrast=' + boolean + '; path=/';
        },
        init: function () {
            var inst = this;
            if (!inst.getCookie().length) {
                inst.setCookie('false');
            } else if (inst.getCookie() == 'true') {
                $(q4Defaults.options.contrast.toggle).addClass(q4Defaults.options.contrast.toggleClass);
                $('body').addClass(q4Defaults.options.contrast.bodyClass);
            }

            $(q4Defaults.options.contrast.toggle).on('click keypress', function (e) {
                if ($(this).is('a, button')) e.preventDefault();
                if (e.keyCode == 13 || e.type == 'click') {
                    if (inst.getCookie() == 'false') {
                        inst.setCookie('true');
                    } else {
                        inst.setCookie('false');
                    }
                    $(this).toggleClass(q4Defaults.options.contrast.toggleClass);
                    $('body').toggleClass(q4Defaults.options.contrast.bodyClass);
                }
            });
        }
    },

    /**
     * Used to scroll to a module within page.
     * @example app.sections();
     */
    sections: function () {
        var hash = decodeURIComponent(window.location.hash.length ? window.location.hash.substring(1) : ''),
            isMobileOpen = function () {
                return $('.layout').hasClass('js--mobile');
            };

        if ($('.module-' + hash).length) {
            setTimeout(function () {
                q4App.scrollTo($('.module-' + hash));
                window.location.hash = hash;
            }, 1000);
        }
        $('nav').on('click', 'a[href*="#"]', function (e) {
            var $parent = $(this).closest('ul').parent('li'),
                hash = $(this).attr('href').split('#')[1];
            if ($parent.hasClass('selected')) {
                if (isMobileOpen()) {
                    $('.layout').removeClass('js--mobile');
                }
                e.preventDefault();
                window.location.hash = hash;
                q4App.scrollTo($('.module-' + hash));
            }
        });
    },

    /**
     * Used to create tabs navigation.
     * @param {$container} [selector]  the wrapping element of tabs navigation links/select
     * @param {triggerContainer} [selector]  the element that wraps all of the tabs
     * @param {trigger} [selector]  the element that will be clicked to show tabs
     * @param {content} [selector]  the tab element that will show/hide when cliking on trigger element
     * @param {select} [string]  the class of select that will be used as tab navigation. Can be null if not needed.
     * @param {useHash} [boolean]  whether or not the tabs should be updated from URL hash. Defaults to true
     * @param {useKBTabs} [boolean]  whether or not the tabs should be keyboard accessible. Defaults to true
     * @example app.tabs($('.tabs'), '.tabs_nav', '.tabs_link', '.tab', '.tabs_select', true, true);
     */
    tabs: function ($container, triggerContainer, trigger, content, select, useHash, useKBTabs) {
        // display specific tab using hash from url
        var hash = window.location.hash.split('#')[1],
            hashTargetExists = $(content + '.' + hash).length > 0,
            changeHash = useHash != undefined ? useHash : true,
            first,
            $hiddenContent = function () {
                return $(content).addClass('js--hidden').attr('aria-hidden', 'true');
            };
        // accessibility 
        $(triggerContainer).attr('role', 'tablist');
        $(trigger).attr('role', 'tab').attr('aria-selected', 'false');  

        if (hash && hashTargetExists) {
            $hiddenContent().filter('.' + hash).removeClass('js--hidden').attr('aria-hidden', 'false');
            if (trigger) $(trigger).attr('tabindex', '0').filter('[data-tab=".' + hash + '"]').addClass('js--selected').attr('aria-selected', 'true');
            if (select) $(select + ' option[value=".' + hash + '"]').attr('selected', true);
        } else {
            $hiddenContent();
        }

        // if trigger is used/defined
        if (trigger) {
            first = $(trigger).first().data('tab');

            if (!hash || !hashTargetExists) {
                $(trigger).attr('tabindex', '0').first().addClass('js--selected').attr('aria-selected', 'true');
                $(first).removeClass('js--hidden').attr('aria-hidden', 'false');
                // change hash on load
                if (changeHash) window.location.hash = first.split('.')[1];
            }

            $container.on('click keypress', trigger, function (e) {
                if (changeHash) window.location.hash = $(this).data('tab').split('.')[1];
                if ($(trigger).is('a, button')) e.preventDefault();
                $(this).addClass('js--selected').attr('aria-selected', 'true').closest($container).find('.js--selected').not(this).removeClass('js--selected').attr('aria-selected', 'false');
                $hiddenContent().filter($(this).data('tab')).removeClass('js--hidden').attr('aria-hidden', 'false');
                // update select
                if (select) {
                    $(select).val($(this).data('tab'));
                }
            });
        }

        // if select is used/defined
        if (select) {
            first = $(select + ' option:first-child').val();

            if (!hash || !hashTargetExists) {
                $(select + ' option:first-child').attr('selected', true);
                $(first).removeClass('js--hidden').attr('aria-hidden', 'false');
                // change hash on load
                if (changeHash) window.location.hash = first.split('.')[1];
            }

            $container.on('change', select, function () {
                var tab = $(this).val();
                if (changeHash) window.location.hash = $(this).val().split('.')[1];
                $hiddenContent().filter(tab).removeClass('js--hidden').attr('aria-hidden', 'false');
                if (trigger) $(trigger).removeClass('js--selected').filter('[data-tab="' + tab + '"]').addClass('js--selected');
            });
        }

        if (useKBTabs || useKBTabs === undefined) {
            var tabs = document.querySelectorAll('[role="tab"]');
            var tabList = document.querySelector('[role="tablist"]');

            // Add a click event handler to each tab
            tabs.forEach( function(tab) { 
                var tabContentID = tab.getAttribute("data-tab").replace(".",""),
                    tabContentIDs = "";

                $("." + tabContentID).each(function(i) {
                    $(this).attr("id", tabContentID + "-" + i);
                    tabContentIDs += (tabContentID + "-" + i + " ");
                });

                tab.setAttribute("aria-controls", tabContentIDs);
                tab.setAttribute("tabindex", -1);  
                tab.addEventListener("click", changeTabs);   
            });
            $('[role="tab"][aria-selected="true"]').attr("tabindex", 0);
          
            // Enable arrow navigation between tabs in the tab list
            var tabFocus = 0;
          
            tabList.addEventListener("keydown", function(e) {
              // Move right
              if (e.keyCode === 39 || e.keyCode === 37) {
                tabs[tabFocus].setAttribute("tabindex", -1);
                if (e.keyCode === 39) {
                  tabFocus++;
                  // If we're at the end, go to the start
                  if (tabFocus >= tabs.length) {
                    tabFocus = 0;
                  }
                  // Move left
                } else if (e.keyCode === 37) {
                  tabFocus--;
                  // If we're at the start, move to the end
                  if (tabFocus < 0) {
                    tabFocus = tabs.length - 1;
                  }
                }
          
                tabs[tabFocus].setAttribute("tabindex", 0);
                tabs[tabFocus].focus();
              }
            });
        }          
         
         function changeTabs(e) {
           var target = e.target;
           var parent = target.closest('[role="tablist"]');
           var grandparent = parent.parentNode;
         
           // Remove all current selected tabs
           parent
             .querySelectorAll('[aria-selected="true"]')
             .forEach( function(t) {t.setAttribute("aria-selected", false);} );
         
           // Set this tab as selected
           target.setAttribute("aria-selected", true);
         
           // Hide all tab panels
           grandparent
             .querySelectorAll('[role="tabpanel"]')
             .forEach( function(p) {p.setAttribute("hidden", true);} );
         
           // Show the selected panels
           var tabContentIDArr = target.getAttribute("aria-controls").split(" ");
           $.each(tabContentIDArr, function(index, value ){
               if (value && value != "") $('#' + value ).removeAttr("hidden");
           });
             
        }
    },

    /**
     * Used to reveal an element by clicking on a trigger element.
     * Use this function to create anything from "Read More" buttons to revealing hidden elements with a trigger.
     * @param {container} [selector]  the wrapping element
     * @param {trigger} [selector]  the element that will be clicked to reveal
     * @param {panel} [selector]  the element to be revealed
     * @param {once} [boolean]  (optional) whether or not the event will be triggered only once
     * @param {includeFocus} [boolean]  (optional) whether to include focus for trigger event
     * @param {containerClass} [string]  the class added to container. Defaults to empty string
     * @param {triggerClass} [string]  the class added to trigger. Defaults to js--active
     * @param {paneClass} [string]  the class added to panel. Defaults to js--revealed
     * @example app.reveal('.read-more', '.read-more_button', '.read-more_panel', true);
     */
    reveal: function (container, trigger, panel, once, includeFocus, containerClass, triggerClass, panelClass) {
        containerClass = containerClass ? containerClass : '';
        triggerClass = triggerClass ? triggerClass : 'js--active';
        panelClass = panelClass ? panelClass : 'js--revealed';
        $(container).find(trigger).attr('tabindex', '0').attr('aria-expanded', 'false');
        $(container).find(panel).attr('aria-hidden', 'true');

        var events = "click keypress";
        var checkEventCondition  = function(e) {
            return (e.keyCode == 13 || e.type == "click");
        };

        if (includeFocus) {
            if(once) {
                events = "keypress focus"; 
                checkEventCondition = function(e) {
                    return (e.keyCode == 13 || (e.type == "focusin" && ($(this).attr('aria-expanded') !== "true")));
                };
            } else {
                events = "mousedown keypress focus"; 
                checkEventCondition = function(e) {
                    return (e.keyCode == 13 || e.type == "mousedown" || (e.type == "focusin" && ($(this).attr('aria-expanded') !== "true")));
                };
            }
        }

        if (once) {
            $(container).one(events, trigger, function (e) {
                if (checkEventCondition(e)) {
                    if ($(container).find(trigger).is('a, button')) e.preventDefault();
                    $(container).toggleClass(containerClass);
                    $(this).toggleClass(triggerClass).attr('aria-expanded', function (i, attr) {
                        return attr == 'true' ? 'false' : 'true';
                    }).closest(container).find(panel).toggleClass(panelClass);
                    $(container).find(panel).attr('aria-hidden', function (i, attr) {
                        return attr == 'true' ? 'false' : 'true';
                    });
                }
            });
        } else {
            $(container).on(events, trigger, function (e) {
                if (checkEventCondition(e)) {
                    if ($(container).find(trigger).is('a, button')) e.preventDefault();
                    $(container).toggleClass(containerClass);
                    $(this).toggleClass(triggerClass).attr('aria-expanded', function (i, attr) {
                        return attr == 'true' ? 'false' : 'true';
                    }).closest(container).find(panel).toggleClass(panelClass);
                    $(container).find(panel).attr('aria-hidden', function (i, attr) {
                        return attr == 'true' ? 'false' : 'true';
                    });
                }
            });
        }
    },

    /**
     * Used to remove the duplicate classes on a Quick Link Module's <ul> element
     * @param {$el} [element]  the quick links module to clean up
     * @example app.cleanQuickLinks($('.module-links'));
     */
    cleanQuickLinks: function ($el) {
        $el.find('ul').attr('class', 'module-links_list');
    },

    /**
     * Scroll to an element on the page
     * @param {$el}  [element] A selector containing the element to scroll to
     * @example app.scrollTo( $('div[id*="SubscriberConfirmation"]') )
     */
    scrollTo: function ($el, duration) {
        var inst = this,
            d = duration !== undefined && !isNaN(duration) ? duration : inst.options.scrollSpeed;
        if ($el.length) {
            if (history) {
                history.scrollRestoration = 'manual';
            }

            $('html, body').animate({
                scrollTop: $el.eq(0).offset().top - inst.options.headerOffset()
            }, d, function () {
                if ($(window).scrollTop() != $el.eq(0).offset().top - inst.options.headerOffset()) {
                    $('html, body').animate({
                        scrollTop: $el.eq(0).offset().top - inst.options.headerOffset()
                    }, d);
                }
            });
        }
    },

    /**
     * Validate if a string is a vaild email address
     * @param {emailAddress} [string]  An email address that will be tested against the regular expression
     * @example app.isValidEmailAddress ( 'support@q4inc.com' );
     * @return boolean
     */
    isValidEmailAddress: function (emailAddress) {
        var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
        return pattern.test(emailAddress);
    },

    /**
     * Attaches a click handler to the modules submit button which will not allow
     * the form to submit without a true email address
     * @param {$el} [element]  an element containing the submit button
     * @example app.validateUnsubscribe($('.MailingListUnsubscribeContainer'));
     */
    validateUnsubscribe: function ($el) {
        var inst = this,
            $submit = $el.find('input[type="submit"]');

        $submit[0].outerHTML = $submit[0].outerHTML.replace(/^<input/, '<button') + '<span class="button_text">' + $submit[0].value + '</span></button>';

        $el.find('[type="submit"]').on('click', function (e) {
            var emailAddress = $el.find('input[id*="Email"]').val();

            if (!inst.isValidEmailAddress(emailAddress)) {
                $el.find('.module_confirmation-container').html(Mustache.render(inst.options.errorTpl, {
                    errors: [{
                        message: emailAddress.length ? inst.options.invalidText : inst.options.requiredText,
                        name: $el.find('label.module-unsubscribe_email').text()
                    }],
                    errorMessage: inst.options.errorMessage
                })).show();

                inst.scrollTo($el.find('.module_error-container'), 0);

                $el.addClass('js--invalid');
                e.preventDefault();
            }
        });

        if ($el.find('.module_confirmation-container').text().trim().length) {
            $('.module-subscribe,' + inst.options.mailingListConfig.hideOnConfirmation).not(inst.options.mailingListConfig.location + ' .module-subscribe').addClass('js--hidden');
            $el.find('.module_introduction, .module-unsubscribe_table, .module_actions').addClass('js--hidden');
            inst.scrollTo($el);
        }
    },

    /**
     * Attaches a check to a search module's submit button which will not allow
     * the module to submit without text inside the search input
     * @param {selector} [selector]  the class being used by the search module
     * @example app.validateSubmit('.module-search');
     */
    validateSubmit: function (selector) {
        var $search = $(selector);

        // also convert input submit to buttons
        $search.each(function(){
            $submit = $(this).find('input:submit');
            $submit[0].outerHTML = $submit[0].outerHTML.replace(/^<input/, '<button') + '<span class="button_text">' + $submit[0].value + '</span></button>';
        });

        $search.on('click', '[type="submit"]', function (e) {
            if (!$(this).closest(selector).find('input:text').val().length) {
                e.preventDefault();
                return false;
            }
        });
    },

    /**
     * Allows the user to submit our forms using the enter key
     * @param {selector} [selector]  the class being used by the formbuilder module
     * @example app.submitOnEnter('.module-form')
     */
    submitOnEnter: function (selector) {
        $(selector).find('input[type="text"], input[type="email"]').removeAttr('onkeypress').on('keydown', function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                $(this).closest(selector).find('[type="submit"]').trigger('click');
                return false;
            }
        });
    },

    /**
     * Creates a select from a list of links.
     * @param {$selector} [element]  the element that contains the links
     * @param {labelText} [string]  (optional) text that will appear inside the label of the select. Defaults to "Select year:"
     * @param {selectId} [string] (optional) the id for the select. Defaults to "YearNav"
     * @param {selectedClass} [string] (optional) the selected class of the link. Defaults to "selected"
     * @param {hideLabel} [boolean] (optional) if true, the label will have "sr-only" class. Defaults to false
     * @example app.makeSelect($('.module-news module_nav'));
     */
    makeSelect: function ($selector, labelText, selectId, selectedClass, hideLabel) {
        var $navOptions = $('<div />', {class: 'module_options'}).insertAfter($selector),
            $options = '';

        if (!selectedClass) {
            selectedClass = 'selected';
        }

        $selector.addClass('js--hidden');
        $('<label />', {
            class: hideLabel ? 'module_options-label sr-only' : 'module_options-label',
            html: labelText ? labelText : 'Select year:',
            for: selectId ? selectId : 'YearNav'
        }).appendTo($navOptions);

        $('<select />', {
            class: 'dropdown module_options-select',
            id: selectId ? selectId : 'YearNav',
            name: selectId ? selectId : 'YearNav'
        }).appendTo($navOptions).on('change', function () {
            location.href = $(this).val();
        });

        $selector.find('a').each(function () {
            var $this = $(this),
                selected = $this.hasClass(selectedClass) ? 'selected="selected"' : '';
            $options += '<option ' + selected + ' value="' + $this.attr('href') + '">' + $this.text() + '</option>';
        });
        $navOptions.find('select').append($options);
    },

    /**
     * Disables first click for android devices and show dropdown instead of loading page.
     * @param {selector} [selector]  the class being used by the navigation module
     * @example app.androidTap('.nav--main');
     */
    androidTap: function (selector) {
        if (q4App.isMobile.Android()) {
            $(selector).on('touch touchstart', 'li.has-children > a, li.has-children.no-link > span', function (e) {
                var $this = $(this),
                    $parent = $this.parent();
                if (!$parent.hasClass('sfHover')) {
                    e.preventDefault();
                    $parent.siblings().removeClass('sfHover');
                    $parent.addClass('sfHover');
                }
            });
        }
    },

    _onMobileMenuExpand: function ($nav, toggler1, lastTabbable) {
        
        var isTouchMove = false;
        $nav.on('touchmove', 'li.has-children:not(.home) > a, li.has-children.no-link:not(.home) > span', function (e) {
            isTouchMove = true;
            var $this = $(this),
                $parent = $this.parent();
            if (!$parent.hasClass('js--expanded') && !isTouchMove) {
                e.preventDefault();
                $parent.siblings().removeClass('js--expanded');
                $parent.addClass('js--expanded');
            }
        });
        $nav.on('touchend', 'li.has-children:not(.home) > a, li.has-children.no-link:not(.home) > span', function (e) {
            var $this = $(this),
                $parent = $this.parent();
            if (!$parent.hasClass('js--expanded') && !isTouchMove) {
                e.preventDefault();
                $parent.siblings().removeClass('js--expanded');
                $parent.addClass('js--expanded');
            }
            isTouchMove = false;
        });

        $nav.find($('li.home')).children('a').attr('tabindex', '0');
        $nav.find($('li:not(.home)')).children('a, button').attr('tabindex', '-1');
        
        if (lastTabbable){
            $(lastTabbable).on("keydown", function(e){
                if (e.which === 9 && !e.shiftKey){
                    $('a.tempanchor').attr('tabindex', '0').focus();
                }
            });
        } else { 
            $nav.find($("li")).on("keydown", function(e){
                if (e.which === 9 && !e.shiftKey){
                    $('a.tempanchor').attr('tabindex', '0').focus();
                }
            });
        }
        $(toggler1).on("keydown", function(e){
            if (e.which === 9 && e.shiftKey){
                e.preventDefault();
            }
        });
    },

    /**
     * Accessible Navigation powered by Superfish
     * @param {$nav} [element]  the nav element (or ul element) you would like to apply superfish to
     * @param {options} [object]  options to be passed into superfish
     * @param {initAndroid} [boolean] (optional) if true, the androidTap function is initialized. Defaults to true
     * @example app.superfish($('.nav--secondary .level2'), {cssArrows:false}, 1024)
     */
    superfish: function ($nav, options, initAndroid) {
        $nav.find('.no-link > span').attr('tabindex', '0');
        var initAndroidTap = initAndroid != undefined ? initAndroid : true;
        if (!this.isMobile.any() && this.options.superfish) {
            $nav.superfish(options);
        }
        if (initAndroidTap) this.androidTap($nav);
    },

    /**
     * Standard mobile menu functionality
     * @param {$layout} [element]  the default layout element
     * @param {pane} [selector]  the class of the pane element containing the mobile navigation
     * @param {toggleClass} [selector]  the class assigned to the element used to toggle the mobile navigation
     * @example app.mobileMenuToggle($('.layout'), '.pane--navigation', '.layout_toggle i')
     */
    mobileMenuToggle: function ($layout, pane, toggle, searchInput) {

        var inst = this;
        $(toggle).attr({
            'aria-expanded':'false',
            'aria-haspopup':'true',
            'aria-label':'Toggle for mobile menu',
            'aria-controls':'accessibleRespNav'
        });
        $(pane + ' ul').first().attr('id','accessibleRespNav');
        $(pane + ' ul').attr('role','menu');
        $(pane + ' ul li a').attr('role', 'menuitem');
        $(pane).addClass('js--hidden');
        $layout.on('click', toggle, function (e) {
            if ($(this).is('a, button')) e.preventDefault();
            $(toggle).attr('aria-expanded', function (i, attr) {
                return attr == 'true' ? 'false' : 'true';
            });
            $layout.toggleClass('js--mobile');
            $(pane).toggleClass('js--hidden');

            var $nav = $('.js--mobile ' + pane + ' .nav'),
                respNavCont = $nav.parents('span'),
                respSearch = null,
                respSearchCont = null,
                navBeforeSearch = true, 
                toggler1 = null,
                toggler2 = null,
                paneChildren = $(pane + ' > div').children(),
                menuLast = true;

            // some themes utilize 2 toggles. let's differentiate.
            $.each($(toggle), function(i, tog){
                $(tog).addClass('toganchor-' + (i));
            });
            if ($(toggle).length > 1){
                toggler1 = '.toganchor-1';
                toggler2 = '.toganchor-0';
            } else {
                toggler1 = '.toganchor-0';
            }

            // focus on first element in popout
            $(pane + ' button, ' + pane + ' a, ' + pane + ' input').not(toggle).first().focus();

            $.each(paneChildren, function(i){
                if ($(this).find('#accessibleRespNav').length !== 0){
                    if (paneChildren.length > (i + 1)){
                        menuLast = false;
                    }
                }
            });
           
            var lastTabbable = menuLast ? false : $(pane + ' button, ' + pane + ' a, ' + pane + ' input').get(-1);

            inst._onMobileMenuExpand($nav, toggler1, lastTabbable);
            
            //exit on esc key
            $(pane).on("keydown", function(e) {
                if (e.which === 27){
                    if (toggler2){
                        $(toggler1).click();
                        $(toggler2).focus();
                    } else {
                        $(toggler1).click().focus();
                    }
                }
            });

            // fix to get around bug with extra tab being invoked after focus
            if (!$("a.tempanchor").length){
                $(toggler1).before("<a tabindex='-1' class='sr-only tempanchor'></a>");
            } else {
                $("a.tempanchor").remove();
            }
        });
    },

    /**
     * Gives a navigation element accessibility assistance in the form of the .focused class.
     * @param {$nav} [element]  the navigation element used for this function
     * @param {topLevel} [selector]  the class assigned to the highest visible level of the navigation
     * @example app.accessibleNav($('.nav'), '.level1')
     */
    accessibleNav: function ($nav, topLevel) {
        $nav.find('.no-link > span').attr('tabindex', '0');
        $nav.on('focus', 'a, .no-link > span', function (e) {
            var $link = $(this);
            $link.closest('ul').find('li').removeClass('js--focused');
            $link.closest('li').addClass('js--focused');

            if ($link.closest('li').is(':last-child') && $link.closest('ul').is(topLevel)) {
                $link.blur(function () {
                    $link.closest(topLevel).find('li').removeClass('js--focused');
                });
            }
        });
    },
    /**
     * Adds text at the beginning of the slider for screen reader and Adds pause / play button.
     * @param {s} [object] the slick instance of the slider. This can be obtained using .slick('getSlick')
     * @param {insertFunction} [string] the jQuery function used to add the autoplayCtrl to slick
     * @param {insertSelector} [string] the selector for the insertFunction
     * @example app.accessibleSlick(s), app.accessibleSlick(s, 'before', '.slick-dots')
     */
    accessibleSlick: function (s, insertFunction, insertSelector) {
        // slick dots will not be in s.$slider if appendDots is set.
        $container = s.options.appendDots;

        // Add screen-reader text at the beginning of the slider.
        $container.before('<span class="sr-only">Slider/Carousel Start</span>');
        
        // Pause / Play control
        var autoplayStatusId = 'autoplay-status-' + ($('[id*="autoplay-status"]').length + 1),
        ctrlTpl = (
            '<span class="slick_autoplay-ctrl">'+
                '<button type="button" aria-label="" aria-controls="'+ autoplayStatusId +'"></button>'+
                '<span id="'+ autoplayStatusId +'" class="sr-only" aria-live="polite"></span>'+
            '</span>'
        ),
        setCtrlBtn = function() {
            var $button = s.$autoplayCtrl.find('button'),
            $status = s.$autoplayCtrl.find('#' + autoplayStatusId),
            pauseCls = "slick_autoplay-ctrl--pause", 
            playCls = "slick_autoplay-ctrl--play";

            $button.removeClass(pauseCls + " " + playCls);
            if(s.paused) {
                $button.addClass(playCls);
                $status.text('Carousel Paused');
                $button.attr('aria-label', 'Play Carousel Toggle ');
            } else { 
                $button.addClass(pauseCls);
                $status.text('Carousel Playing');
                $button.attr('aria-label', 'Pause Carousel Toggle ');
            }
        }, 
        autoplayToggle = function() {
            if (s.paused) {
                s.slickPlay();
            } else {
                s.slickPause();
            }
            setCtrlBtn();
            s.autoplaying = !s.paused;
        }, 
        pauseAutoplay = function() {
            if(!s.paused){
                s.slickPause();
                setCtrlBtn();
            }				
        }, 
        playAutoplay = function() {
            if(s.paused) {
                s.slickPlay(); 
                setCtrlBtn();
            }
        };

        s.autoplaying = s.options.autoplay;
        if(insertFunction && $(insertSelector).length) {
            $.fn.insertAutoplay = $()[insertFunction];
        }

        if($.fn.insertAutoplay) {
            $container.find(insertSelector).insertAutoplay(ctrlTpl);
        } else {
            $container.append(ctrlTpl);
        }

        s.$autoplayCtrl = $container.find('.slick_autoplay-ctrl');
        setCtrlBtn();

        s.$autoplayCtrl.find('button').on('click touchstart', function(e){
            e.stopPropagation(); 
            e.preventDefault();

            autoplayToggle();
        });
        // pauseOnHover
        if (s.options.pauseOnHover) {
            s.$list.on('mouseenter.slick', function(e){
                    pauseAutoplay();
            });

            s.$list.on('mouseleave.slick', function(e){
                if(!s.focussed && s.autoplaying) playAutoplay();
            });
        }
        // pauseOnDotsHover
        if (s.options.pauseOnDotsHover) {
            s.$dots.on('mouseenter.slick', function(e){
                pauseAutoplay();
            });

            s.$dots.on('mouseleave.slick', function(e){
                if (s.autoplaying) playAutoplay();
            });
        }
        // pauseOnFocus
        if (s.options.pauseOnFocus){
            s.$slider
            .off('focus.slick blur.slick')
            .on('focus.slick blur.slick', '*', function(e) {
                if($(this).is(':focus') && !s.paused && $(this)[0].className.indexOf('slick_autoplay') == -1){
                    pauseAutoplay();
                } else if(e.type == "focusout" && $(this)[0].className.indexOf('slick_autoplay') > -1 && s.autoplaying && s.paused) {
                    playAutoplay();
                }
            });
        }
    },
    /**
     * Provides a visually hidden div with aria-live attribute used to make announcements.
     *  @param {ariaLiveVal} [string] the value for the aria-live attribute.
     *  @param {id} [string] the value for the hidden div's id attribute.
     *  @param {insertionSelector} [string] the selector for where the hidden div should be appended to. 
     *  @param {triggerFn} [function] a callback function that has access to the hidden div in order to update the announcement when events occur.
     *  @example app.a11yAnnouncement('polite', 'fancy-box_announcement', '.media-center--videos', function($elem){});
     */
    a11yAnnouncement: function(ariaLiveVal, id, insertionSelector, triggerFn) {
        var hiddenDiv = '<div id="'+ id +'" class="sr-only" aria-live="'+ ariaLiveVal +'" ></div>'; 
        $(insertionSelector).append(hiddenDiv);
        triggerFn($('#' + id)); 
    },
    /**
     * Gives element accessibility properties suitable for accordions, slide toggles, and tab navigation.
     * @param {$tab} [element]  the element used to toggle the appropriate $tabpanel
     * @param {$tabpanel} [element]  the element intended to display in respect to the currently selected $tab
     * @example app.accessibilize($tab, $tabpanel)
     */
    accessibilize: function($tab, $tabpanel, idx) {
        $tab.each(function(index){
            $(this).attr('tabindex','0').attr({
                'id': 'tab' + idx + (index+1),
                'role': 'button',
                'aria-expanded': 'false',
                'aria-controls': 'panel' + idx + (index+1),
            });
        });
        $('#tab' + idx + "1").addClass('tab-firsttab');       
        $('#tab' + idx + ($tab.length)).addClass('tab-lasttab');       

        $tabpanel.each(function(index){
            $(this).addClass('js--hidden').attr({
                'id': 'panel' + idx + (index+1),
                'role': 'region',
                'aria-hidden': 'true',
                'aria-describedby': 'tab' + idx + (index+1)
            });
        });
    },
    /**
     * Creates a fully accessible expanding and collapsing accordion with the ability to switch between toggle and accordion functionality. Accessiblity example cand be seen here https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
     * @param {$container} [element]  the wrapping element for the toggle list
     * @param {item} [selector]  the class assigned to each designated toggling element
     * @param {toggle} [selector]  the class assigned to the element that will toggle the containing item
     * @param {panel} [selector]  the class assigned to the section that will be revealed if its containing item is toggled
     * @param {accordion} [boolean]  (optional) if true, the toggling section will take on accordion functionality
     * @param {allButton} [boolean]  (optional) if true, the toggling section will be accompanied by a "Hide All / Show All" button
     * @param {openFirst} [boolean]  (optional) if true, the first item will be set to active with its panel revealed
     * @param {includeClasses} [boolean]  (optional) if true, classes will be added to the container (accordion), items (accordion_item), toggle (accordion_toggle) and panel (accordion_panel).
     * @example app.toggle($('.accordion'), '.accordion_item', '.accordion_toggle', '.accordion_panel', false, true);
     */
    toggle: function($container, item, toggle, panel, accordion, allButton, openFirst, includeClasses) {
        var $this = this,
            $item = $container.find(item),
            keyCode = {
                'ENTER': 13,
                'SPACE': 32,
                'DOWN': 40,
                'UP': 38,
                'HOME': 36,
                'END': 35
            };

        $container.each(function(idx){
            $this.accessibilize($(this).find(toggle), $(this).find(panel), (idx+1));
            if (accordion) {
                $(this).find(toggle).attr('aria-disabled','false');
            }
        });
        
        $item.on('click keypress keydown', toggle, function(e) {
            if (e.which == keyCode.ENTER || e.type == 'click' || (e.type == 'keydown' && e.which == keyCode.SPACE)) {
                e.preventDefault();
                if (accordion) {
                    $this._accordionTrigger($(this), $(this).closest($container), item, toggle, panel);
                } else {
                    $this._toggleTrigger($(this), $(this).closest($container), item, panel);
                }

                if (allButton) {
                    if (!$(this).closest($container).find(item + '.js--active').length) {
                        $(this).closest($container).find('.toggle-all').removeClass('js--active');
                    }
                    if ($(this).closest($container).find(item + '.js--active').length === $(this).closest($container).find(item).length) {
                        $(this).closest($container).find('.toggle-all').addClass('js--active');
                    }
                }
            } else if (e.which == keyCode.UP) { 
                e.preventDefault();
                if ($(e.target).hasClass('tab-firsttab')){
                    $(this).closest($item).siblings(item).children('.tab-lasttab').focus();
                } else {
                    $(this).closest($item).prev(item).children(toggle).focus();
                }
            } else if (e.which == keyCode.DOWN) { 
                e.preventDefault();
                if ($(e.target).hasClass('tab-lasttab')){
                    $(this).closest($item).siblings(item).children('.tab-firsttab').focus();
                } else {
                    $(this).closest($item).next(item).children(toggle).focus();
                }
            } else if (e.which == keyCode.HOME) { 
                e.preventDefault();
                $(this).closest($item).siblings(item).children('.tab-firsttab').focus();
            } else if (e.which == keyCode.END) { 
                e.preventDefault();
                $(this).closest($item).siblings(item).children('.tab-lasttab').focus();
            }
        });

        if (allButton) {
            $this._toggleAll($container, item, toggle, panel);
        }

        if (openFirst) {
            $container.each(function () {
                $(this).find($item).first().find(toggle).attr('aria-expanded', 'true');
                $(this).find($item).first().addClass('js--active').find(panel).removeClass('js--hidden').attr('aria-hidden','false');
                $(this).find($item).not(':first').find(panel).hide().attr('aria-hidden','true');
                if (accordion) {
                    $(this).find($item).first().find(toggle).attr('aria-disabled', 'true');
                }
            });
        }
         
        $container
            .attr('data-accordion','container')
            .find(item).attr('data-accordion','item').end()
            .find(toggle).attr('data-accordion','toggle').end()
            .find(panel).attr('data-accordion','panel');
            
        if (includeClasses) {
            $container
                .addClass('accordion')
                .find(item).addClass('accordion_item').end()
                .find(toggle).addClass('accordion_toggle').end()
                .find(panel).addClass('accordion_panel');
        }
            
    },
    _toggleAll: function($container, item, toggle, panel) {
        $container.prepend(
            '<div class="toggle-all"><button aria-label="Expand or collapse all items" type="button" class="button"></button><span class="sr-only" role="status" aria-live="polite"></span></div>'
        ).on('click', '.toggle-all button', function(e) {
            e.preventDefault();
            $(this).parent().toggleClass('js--active');
            if ( $(this).parent().is('.js--active') ) {
                $(this).attr('aria-pressed', 'true');
                $(this).siblings('[role="status"]').text('Button pressed. All items expanded');
                $(this).closest($container).find(toggle).attr('aria-expanded', 'true');
                $(this).closest($container).find(item).addClass('js--active');
                $(this).closest($container).find(panel).slideDown(400, function() {
                    $(this).removeClass('js--hidden').attr('aria-hidden','false');
                });
            } else {
                $(this).attr('aria-pressed', 'false');
                $(this).siblings('[role="status"]').text('Button not pressed. All items collapsed');
                $(this).closest($container).find(toggle).attr('aria-expanded', 'false');
                $(this).closest($container).find(item).removeClass('js--active');
                $(this).closest($container).find(panel).slideUp(400, function() {
                    $(this).addClass('js--hidden').attr('aria-hidden','true');
                });
            }
        });
        $container.on('click keypress keydown', item, function(e) {
            if (e.which == 13 || e.which == 1) {
                if ( $(this).siblings('.toggle-all').hasClass('js--active') ) {
                    $(this).siblings('.toggle-all').children('button').attr('aria-pressed', 'true');
                } else {
                    $(this).siblings('.toggle-all').children('button').attr('aria-pressed', 'false');
                }
            }
        });
    },
    _accordionTrigger: function($this, $container, item, toggle, panel) {
        if ( !$this.closest(item).hasClass('js--active') ) {
            $this.closest($container).find(item).removeClass('js--active');
            $container.find(toggle).attr({
                'aria-expanded': 'false',
                'aria-disabled': 'false'
            }).end().find(panel).slideUp(400, function() {
                $(this).addClass('js--hidden').attr({
                    'aria-hidden': 'true'
                });
            });

            $this.attr({
                'aria-expanded': 'true',
                'aria-disabled': 'true'
            }).closest(item).addClass('js--active').find(panel).slideDown(400, function() {
                $(this).removeClass('js--hidden').attr({
                    'aria-hidden': 'false'
                });
            });
        }
    },
    _toggleTrigger: function($this, $container, item, panel) {
        var $allToggle = $this.closest($container).find('.toggle-all');

        $this.attr('aria-expanded', function(i, attr) {
            return attr == 'true' ? 'false' : 'true';
        }).closest(item).toggleClass('js--active').find(panel).slideToggle(400, function() {
            $(this).toggleClass('js--hidden').attr('aria-hidden', function(i, attr) {
                return attr == 'true' ? 'false' : 'true';
            });
        });

        if ( $this.closest($container).find(item).not('.js--active').length ) {
            $allToggle.removeClass('js--active');
        } else {
            $allToggle.addClass('js--active');
        }
    },

    /**
     * Used to hide the "Remind Me" functionality for events modules if a reminder has already been created.
     * Works for both list and details pages.
     * @param {$el} [element]  element(s) containing the "Remind Me" form
     * @example app.remindMeOnce($('.module-event .module_item')); or app.remindMeOnce($('.module-event-details'));
     */
    remindMeOnce: function ($el) {
        $el.each(function () {
            if ($(this).find('.module_reminder-success').text().length) {
                $(this).find('.module_reminder').addClass('js--reminded');
            }
        });
    },

    /**
     * Our standard "Add to Calendar" functionality. Opens up a fancybox.
     * @param {selector} [element]  Selector for the module containing "Add to Calendar" links
     * @example app.addToCalendar('.module-event'); or app.addToCalendar('.module-event-latest, .module-event-upcoming');
     */
    addToCalendar: function (selector) {
        $(selector).on('click keypress', '.module_add-to-calendar-reveal', function (e) {
            var $this = $(this);
            if (e.keyCode == 13 || e.type == 'click') {
                $.fancybox.open({
                    src: $(this).next(),
                    type: 'inline',
                    opts: {
                        closeBtn: false,
                        fullScreen: false,
                        slideClass: 'fancybox-slide--no-padding',
                        afterClose: function(instance, current){
                            $this.trigger('focus'); // focus back to the element that initiated the popup
                        }
                    }
                });
            }
        });
    },
    /**
     * Used to hide the "Add to Calendar" functionality for past events. Works for both list and details pages.
     * @param {$events} [element]  element(s) containing the unwanted "Add to Calendar" link
     * @example app.hidePastCal($('.module-event .module_item')); or app.hidePastCal($('.module-event-details'));
     */
    hidePastCal: function ($events) {
        var today = new Date();

        $events.each(function () {
            var $this = $(this),
                $date = $this.find('.module_date-text');
            if ($date.text().indexOf("from") >= 0) {
                var isolateDate = $date.text().split('from ').pop().split('to ');
                if (today > new Date(isolateDate[1])) {
                    $this.find('.module_add-to-calendar').addClass('js--hidden');
                }
            } else if (today > new Date($date.text())) {
                $this.find('.module_add-to-calendar').addClass('js--hidden');
            }
        });
    },
    /**
     * Opens the Mailing List Signup - Captcha inside a fancybox
     * @param {$el} [element] The mailing list module
     * @example app.fancySignup( '.module-subscribe' );
     */
    fancySignup: function () {
        var inst = this,
            validationLock = true,
            signup = inst.options.mailingListSignupCls,
            $signup = $(signup),
            confirm = 'div[id*="SubscriberConfirmation"]',
            $confirm = $('div[id*="SubscriberConfirmation"]'), // jshint ignore:line
            footerSuccess = inst.options.mailingListConfig.location + ' ' + confirm + ' .module_message--success',
            $footerSuccess = $(footerSuccess);

        // Subscriber Confirmation fix
        if ($confirm.is(':visible')) {
            if ($confirm.filter(':visible').closest(inst.options.mailingListConfig.location).length) {
                var successText = $confirm.filter(':visible').closest(inst.options.mailingListConfig.location).find('.module_message--success').text();
                $confirm.filter(':visible').parent().html(inst.options.mailingListConfig.tpl).find('.module_message--success').html(successText);
            }
            inst.scrollTo($('div[id*="SubscriberConfirmation"]').filter(':visible'), 0);
            if (!$footerSuccess.length) {
                $('.module-unsubscribe,' + inst.options.mailingListConfig.hideOnConfirmation).addClass('js--hidden');
            }
        }

        if (!$signup.length) {
            return;
        }

        $signup.each(function () {
            var $this = $(this);

            // If a confirmation or error message is visible on page load, scroll to the module
            if ($this.find('input.module_input').length && $this.find('input.module_input').val().length) {
                inst.scrollTo($this, 0);
            }
            // Create a second submit button to be displayed inside fancybox. Replace input type submit with button
            var $submit = $this.find('input[type="submit"]');
            $submit.addClass('js--hidden');
            $submit[0].outerHTML = $submit[0].outerHTML.replace(/^<input/, '<button') + '<span class="button_text">' + $submit[0].value + '</span></button>';
            $this.find('.module_actions').append('<button type="submit" class="button module-subscribe_submit-button module-subscribe_submit-button--fancy"><span class="button_text">' + inst.options.mailingListConfig.submitText + '</span></button>');

            $this.on('click', '.module-subscribe_submit-button--fancy', function (e) {
                e.preventDefault();
                validationLock = false;

                var $parent = $(this).closest(signup),
                    errors = inst._mailingListValidation($parent);

                if (!errors.length) {
                    $(this).closest(signup).find('.module_actions [type="submit"]').not(this).trigger('click');
                    return false;
                } else {
                    inst.scrollTo($this.find('.module_error-container'), 0);
                }

                return false;
            });

            // add aria-label attributes. unable to add required attribute because of CMS being a form and has it's own validation
            $this.find('.module_required').closest('.module-subscribe_table-input').find('input').attr("aria-required", "true");
            
            // Run validation on change
            $this.find('input, select').on('change', function () {
                if (!validationLock) {
                    inst._mailingListValidation($this);
                }
            });

            // Validate submit on enter
            $this.find('input[type="text"], input[type="email"]').on('keydown', function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    $(this).closest(signup).find('.module_actions [type="submit"]').trigger('click');
                    return false;
                }
            });
        });
    },
    /**
     * Validates all required fields.
     * Used by default with fancySignup before displaying captcha.
     * Returns an array of errors
     * @param {$el} [element] The mailing list module
     */
    _mailingListValidation: function ($el) {
        var inst = this,
            errors = [];

        $el.find('.js--invalid').removeClass('js--invalid');

        $el.find('.module_required').each(function () {
            var $item = $(this).closest('.module-subscribe_table-input'),
                message = inst.options.requiredText,
                field = $item.find('label:first').text(),
                validation = true;

            // Does the input exist?
            if ($item.find('input').length) {
                if ($item.hasClass('module-subscribe_email')) {
                    // Does the email address contain text?
                    if (!$item.find('input').val().length) {
                        validation = false;
                    }
                    // Is the email address valid?
                    else if (!inst.isValidEmailAddress($item.find('input').val())) {
                        validation = false;
                        message = inst.options.invalidText;
                    }
                }
                // Does the input contain text?
                else if (!$item.find('input').val().length) {
                    validation = false;
                }
            } else if ($item.find('select').length) {
                if (!$item.find('select option:selected').index()) {
                    validation = false;
                }
            } else {
                if (!$item.closest('table').find('input[type="checkbox"]:checked').length) {
                    $item = $item.next();
                    validation = false;
                }
            }

            if (!validation) {
                $item.addClass('js--invalid');
                errors.push({
                    name: field,
                    message: message
                });
            }
        });

        if (errors.length) {
            $el.find('.module_error-container').html(Mustache.render(inst.options.errorTpl, {
                errors: errors,
                errorMessage: inst.options.errorMessage
            })).show();
        } else {
            $el.find('.module_error-container').html('');

        }

        return errors;
    },

    /**
     * Used to automatically set the copyright year to the current year.
     * @param {$el} [element]  an element that will have its html replaced by the year
     * @example app.copyright($('.copyright_year'));
     */
    copyright: function ($el) {
        $el.html(new Date().getFullYear());
    },

    /**
     * Small plugin used for document tracking w/ Google Analytics
     * @example app.docTracking();
     */
    docTracking: function () {

        if (!!window.ga) {
            var fileTypes,
                domainRegex,
                cdnRegex,
                httpRegex,
                baseHref,
                baseTag,
                currentPageMatches,
                currentDomain;

            // Fix for IE8
            window.hasOwnProperty = window.hasOwnProperty || Object.prototype.hasOwnProperty; // jshint ignore:line

            baseHref = '';
            fileTypes = /\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|mp4|txt|rar|html|wma|mov|avi|wmv|flv|wav)(\?.*)?$/i;
            domainRegex = /^https?:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i;
            httpRegex = /^https?\:\/\//i;
            cdnRegex = /.*\.cloudfront\.net$/i;
            currentPageMatches = window.location.href.match(domainRegex);
            currentDomain = currentPageMatches.length > 0 ? currentPageMatches[1] : false;
            baseTag = $('base');

            if (baseTag.length > 0 && baseTag.attr('href') !== undefined) {
                baseHref = baseTag.attr('href');
            }

            $('body').on('click', 'a', function (event) {
                var el,
                    elEv,
                    href,
                    domainMatches,
                    linkDomain,
                    isSiteDomain,
                    extensionMatch;

                el = $(this);
                href = el.attr('href') || '';

                // Don't do anything with javascript links
                if (href.match(/^javascript:/i)) {
                    return;
                }

                // Extract domain from link
                domainMatches = href.match(domainRegex);

                // Set link domain to the current if nothing matched (e.g. relative URL, tel/mailto)
                linkDomain = null !== domainMatches ? domainMatches[1] : currentDomain;

                // Does the domain match, or is this a CDN
                isSiteDomain = linkDomain === currentDomain || cdnRegex.test(linkDomain) || linkDomain.toLowerCase().indexOf('q4cdn') > -1;

                // Event defaults
                elEv = {
                    value: 0,
                    non_i: false,
                    action: 'click',
                    loc: href
                };

                if (href.match(/^mailto\:/i)) {
                    // Email links
                    elEv.category = 'email';
                    elEv.label = href.replace(/^mailto\:/i, '');
                } else if (href.match() && !isSiteDomain) {
                    // External downloads always have http[s]
                    elEv.category = 'external';
                    elEv.label = href.replace(httpRegex, '');
                    elEv.non_i = true;
                } else if (null !== (extensionMatch = href.match(fileTypes))) {
                    // Matches a filetype we care about (extensionMatch[1] is the type)
                    elEv.category = 'download';
                    elEv.action = 'download';
                    elEv.label = href.replace(/ /g, '-').replace(httpRegex, '');
                    // Only add the base ref if its not a CDN link, or if the link is relative
                    elEv.loc = (cdnRegex.test(linkDomain) ? '' : baseHref) + href;
                } else if (href.match(/^tel\:/i)) {
                    // iOS tel:// links
                    elEv.category = 'telephone';
                    elEv.action = 'click';
                    elEv.label = href.replace(/^tel\:/i, '');
                } else {
                    return;
                }

                window.ga('send', 'event', elEv.category, elEv.action, elEv.label.toLowerCase(), elEv.value, {'nonInteraction': elEv.non_i});
                window.ga('Client.send', 'event', elEv.category, elEv.action, elEv.label.toLowerCase(), elEv.value, {'nonInteraction': elEv.non_i});
            });
        }
    },
    accessibleNavKeyboard: function(navMainSelector, mainNavLevel, navSecondarySelector) {
        var navMenuMain, navMenuSecondary, menubarMain, menubarSecondary, navItemsMain, navItemsSecondary, navItemsAll;
        
        navMenuMain = document.querySelectorAll(navMainSelector)[0].getElementsByClassName('level' + mainNavLevel)[0];
        navMenuSecondary = document.querySelectorAll(navSecondarySelector)[0].getElementsByClassName('level' + mainNavLevel)[0];
        navItemsMain = $(navMainSelector +  ' .level' + mainNavLevel + ' > li').toArray();
        navItemsSecondary = $(navSecondarySelector +  ' .level' + mainNavLevel + ' > li').toArray();
        navItemsAll = navItemsMain.concat(navItemsSecondary);

        // $(navMainSelector).each(function(idx, val){
        //     navGuide = "<div id='nav_guide" + (idx + 1) + "' class='nav_guide'> 1. Use Left/Right arrow keys to allow users to navigate within the navigation links. 2. Use Down arrow key to expand the submenu and up/down arrow keys to navigate within the submenu. 3. Use Enter/Space key to select the menu/submenu items. 4. Use Esc key to leave the submenu. 5. Use Home to select the first item in the menu and End to select the last item in the menu. 6. Use character keys to select the next item having a name that starts with the typed character. </div>";
        //     $(this).before(navGuide);
        // });

        if (mainNavLevel == '2') {
            $(navMainSelector + ' .level' + mainNavLevel).prepend('<li class="home"></li>');
            $(navMainSelector + ' .level' + mainNavLevel + ' .home').append($(navMainSelector + ' .level1 > li > a:first-child')[0]);
            $(navMainSelector + ' .level1').attr('role','none');
            $(navSecondarySelector + ' .level' + mainNavLevel).prepend('<li class="home"></li>');
            $(navSecondarySelector + ' .level' + mainNavLevel + ' .home').append($(navSecondarySelector + ' .level1 > li > a:first-child')[0]);
            $(navSecondarySelector + ' .level1').attr('role','none');
        } else if (mainNavLevel == '1') {
            $(navMainSelector + ' .level' + mainNavLevel + ' li').first().addClass('home');
            $(navSecondarySelector + ' .level' + mainNavLevel + ' li').first().addClass('home');
        }

        $(navMainSelector + ' .level' + mainNavLevel).off("focusin.superfish", "li").off("focusout.superfish", "li").attr('role','menu');
        $(navMainSelector + ' .level' + mainNavLevel).find('ul').attr('role','menu');
        $(navMainSelector + ' li').attr('role','none');
    
        $(navMainSelector + ' a').each(function () {
            $(this).attr('tabindex', '-1').attr('role','menuitem');
        });
    
        $(navMainSelector + ' li.no-link span').each(function () {
            $(this).attr('tabindex', '-1');
        });
    
        $(navMainSelector + ' a:first').attr('tabindex', '0');

        $(navSecondarySelector + ' a').each(function () {
            $(this).attr('tabindex', '-1').attr('role','menuitem');
        });
    
        $(navSecondarySelector + ' span').each(function () {
            $(this).attr('tabindex', '-1');
        });

        $(navItemsAll).each(function(){
            // due to product bug we also have to check for UL inside
            if ($(this).hasClass('has-children') && $(this).find('> ul').length){
                var menuLink = $(this).children().first('a'),
                    linkText = menuLink.text();
                                    
                menuLink.attr('role', 'none').wrap('<button role="menuitem" type="button" aria-label="' + linkText + '" class="submenu-trigger" aria-haspopup="true" aria-expanded="false" tabindex="-1" ></button>');
            } else if ( $(this).hasClass('has-children') && !$(this).find('> ul').length ) {
                // removing the bugged class if there's no UL
                $(this).removeClass('has-children');
            }
        });
        
        $(navSecondarySelector + ' .level' + mainNavLevel).off("focusin.superfish", "li").off("focusout.superfish", "li").attr('role','menu');
        $(navSecondarySelector + ' li.has-children:not(.home)').on('mouseover',function(){ $(this).children('button').attr('aria-expanded','true'); });
        $(navSecondarySelector + ' li.has-children:not(.home)').on('mouseout',function(){ $(this).children('button').attr('aria-expanded','false'); });

        var MenubarItem = function (domNode, menuObj, menuStyle) {
            this.menu = menuObj;
            this.domNode = domNode;
            this.menuStyle = menuStyle;
            this.popupMenu = false;
            this.hasFocus = false;
            this.hasHover = false;
            this.isMenubarItem = true;
            this.keyCode = Object.freeze({
                'TAB': 9,
                'RETURN': 13,
                'ESC': 27,
                'SPACE': 32,
                'PAGEUP': 33,
                'PAGEDOWN': 34,
                'END': 35,
                'HOME': 36,
                'LEFT': 37,
                'UP': 38,
                'RIGHT': 39,
                'DOWN': 40
            });
        };
        
        MenubarItem.prototype.init = function () {
            this.domNode.tabIndex = -1;
            this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
            this.domNode.addEventListener('focus', this.handleFocus.bind(this));
            this.domNode.addEventListener('blur', this.handleBlur.bind(this));
            this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
            this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
    
            // Initialize pop up menus
            var nextElement = this.domNode.nextElementSibling;
            if (nextElement && nextElement.tagName === 'UL') {
                this.popupMenu = new PopupMenu(nextElement, this, this.menuStyle);
                this.popupMenu.init();
            }
        };
    
        MenubarItem.prototype.handleKeydown = function (event) {
            var tgt = event.currentTarget,
                char = event.key,
                flag = false,
                clickEvent,
                menuStyle = this.menuStyle;
    
            function isPrintableCharacter(str) {
                return str.length === 1 && str.match(/\S/);
            }
            
            switch (event.keyCode) {
                case this.keyCode.SPACE:
                    event.preventDefault();
                    if(tgt.tagName === 'A'){
                        tgt = tgt;
                    } else if (tgt.tagName === 'BUTTON'){
                        tgt = this.domNode.childNodes[0];
                    }
                    // Create simulated mouse event to mimic the behavior of ATs
                    // and let the event handler handleClick do the housekeeping.
                    try {
                        clickEvent = new MouseEvent('click', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                    }
                    catch (err) {
                        if (document.createEvent) {
                            // DOM Level 3 for IE 9+
                            clickEvent = document.createEvent('MouseEvents');
                            clickEvent.initEvent('click', true, true);
                        }
                    }
                    tgt.dispatchEvent(clickEvent);
                    break;
                
                case this.keyCode.RETURN:
                    if (this.popupMenu) {
                        this.popupMenu.open();
                        this.popupMenu.setFocusToFirstItem();
                        flag = true;
                    }
                    break;
    
                case this.keyCode.DOWN:
                    if (menuStyle == 'horizontal'){
                        if (this.popupMenu) {
                            this.popupMenu.open();
                            this.popupMenu.setFocusToFirstItem();
                            flag = true;
                        } else{
                            event.preventDefault();
                        }
                    }
                    else if (menuStyle == 'vertical'){
                        this.menu.setFocusToNextItem(this);
                        flag = true;
                    }
                    break;
                
                case this.keyCode.UP:
                    if (menuStyle == 'horizontal'){
                        event.preventDefault();
                    }
                    else if (menuStyle == 'vertical'){
                        this.menu.setFocusToPreviousItem(this);
                        flag = true;
                    }
                    break;
    
                case this.keyCode.LEFT:                    
                    this.menu.setFocusToPreviousItem(this);
                    flag = true;
                    break;

                case this.keyCode.RIGHT:
                    this.menu.setFocusToNextItem(this);
                    flag = true;
                    break;

                case this.keyCode.HOME:
                case this.keyCode.PAGEUP:
                    this.menu.setFocusToFirstItem();
                    flag = true;
                    break;
    
                case this.keyCode.END:
                case this.keyCode.PAGEDOWN:
                    this.menu.setFocusToLastItem();
                    flag = true;
                    break;
    
                case this.keyCode.TAB:
                    if (this.popupMenu){
                        this.popupMenu.close(true);
                    }
                    break;
    
                case this.keyCode.ESC:
                    if (this.popupMenu){
                        this.popupMenu.close(true);
                    }
                    break;
    
                default:
                    if (isPrintableCharacter(char)) {
                        this.menu.setFocusByFirstCharacter(this, char);
                        flag = true;
                    }
                    break;
            }
    
            if (flag) {
                event.stopPropagation();
                event.preventDefault();
            }
        };
    
        MenubarItem.prototype.setExpanded = function (value) {
            if (value) {
                this.domNode.setAttribute('aria-expanded', 'true');
            }
            else {
                this.domNode.setAttribute('aria-expanded', 'false');
            }
        };
    
        MenubarItem.prototype.handleFocus = function (event) {
            this.menu.hasFocus = true;
        };
    
        MenubarItem.prototype.handleBlur = function (event) {
            this.menu.hasFocus = false;
        };
    
        MenubarItem.prototype.handleMouseover = function (event) {
            this.hasHover = true;
            if ($(this).children("ul").length) {
                this.popupMenu.open();
            }
        };
    
        MenubarItem.prototype.handleMouseout = function (event) {
            this.hasHover = false;
            if ($(this).children("ul").length) {
                setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
            }
        };
    
        /*
        *   This content is licensed according to the W3C Software License at
        *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
        */
    
        var Menubar = function (domNode, menuStyle) {

            var elementChildren,
                msgPrefix = 'Menubar constructor argument menubarNode ';
    
            // Check whether menubarNode is a DOM element
            if (!(domNode instanceof Element)) {
                throw new TypeError(msgPrefix + 'is not a DOM Element.');
            }
    
            // Check whether menubarNode has descendant elements
            if (domNode.childElementCount === 0) {
                throw new Error(msgPrefix + 'has no element children.');
            }
    
            // Check whether menubarNode has A elements
            e = domNode.firstElementChild;
            while (e) {
                var menubarItem = e.firstElementChild;
                if (e && menubarItem && menubarItem.tagName !== 'A' && menubarItem.tagName !== 'BUTTON') {
                    throw new Error(msgPrefix + 'has child elements are not A elements.');
                }
                e = e.nextElementSibling;
            }
    
            this.isMenubar = true;
            this.menuStyle = menuStyle;
            this.domNode = domNode;
    
            this.menubarItems = []; // See Menubar init method
            this.firstChars = []; // See Menubar init method
    
            this.firstItem = null; // See Menubar init method
            this.lastItem = null; // See Menubar init method
    
            this.hasFocus = false; // See MenubarItem handleFocus, handleBlur
            this.hasHover = false; // See Menubar handleMouseover, handleMouseout
        };
    
        /*
        *   @method Menubar.prototype.init
        *
        *   @desc
        *       Adds ARIA role to the menubar node
        *       Traverse menubar children for A elements to configure each A element as a ARIA menuitem
        *       and populate menuitems array. Initialize firstItem and lastItem properties.
        */
        Menubar.prototype.init = function () {
            var menubarItem, childElement, menuElement, textContent, numItems;
            
            // Traverse the element children of menubarNode: configure each with
            // menuitem role behavior and store reference in menuitems array.
            elem = this.domNode.firstElementChild;

            while (elem) {
                menuElement = elem.firstElementChild;
    
                if (elem && menuElement && menuElement.tagName === 'A' || elem && menuElement && menuElement.tagName === 'BUTTON') {
                    menubarItem = new MenubarItem(menuElement, this, this.menuStyle);
                    menubarItem.init();
                    this.menubarItems.push(menubarItem);
                    textContent = menuElement.textContent.trim();
                    this.firstChars.push(textContent.substring(0, 1).toLowerCase());
                }
    
                elem = elem.nextElementSibling;
            }

            // Use populated menuitems array to initialize firstItem and lastItem.
            numItems = this.menubarItems.length;
            if (numItems > 0) {
                this.firstItem = this.menubarItems[0];
                this.lastItem = this.menubarItems[numItems - 1];
            }
            this.firstItem.domNode.tabIndex = 0;
        };
    
        /* FOCUS MANAGEMENT METHODS */
    
        Menubar.prototype.setFocusToItem = function (newItem) {

            var flag = false;
    
            for (var i = 0; i < this.menubarItems.length; i++) {
                var mbi = this.menubarItems[i];

                if (mbi.domNode.tabIndex == 0) {
                    flag = mbi.domNode.getAttribute('aria-expanded') === 'true';
                }

                mbi.domNode.tabIndex = -1;
                if (mbi.popupMenu) {
                    mbi.popupMenu.close();
                }
            }

            newItem.domNode.focus();

            newItem.domNode.tabIndex = 0;
    
            if (flag && newItem.popupMenu) {
                newItem.popupMenu.open();
            }
        };
    
        Menubar.prototype.setFocusToFirstItem = function (flag) {
            this.setFocusToItem(this.firstItem);
        };
    
        Menubar.prototype.setFocusToLastItem = function (flag) {
            this.setFocusToItem(this.lastItem);
        };
    
        Menubar.prototype.setFocusToPreviousItem = function (currentItem) {
            var index;
    
            if (currentItem === this.firstItem) {
                newItem = this.lastItem;
            }
            else {
                index = this.menubarItems.indexOf(currentItem);
                newItem = this.menubarItems[index - 1];
            }

            this.setFocusToItem(newItem);
        };
    
        Menubar.prototype.setFocusToNextItem = function (currentItem) {
            var index;

            if (currentItem === this.lastItem) {
                newItem = this.firstItem;
            }
            else {
                index = this.menubarItems.indexOf(currentItem);
                newItem = this.menubarItems[index + 1];
            }
    
            this.setFocusToItem(newItem);
        };
    
        Menubar.prototype.setFocusByFirstCharacter = function (currentItem, char) {
            var start, index = char.toLowerCase();
            char = char.toLowerCase();
            var flag = currentItem.domNode.getAttribute('aria-expanded') === 'true';
    
            // Get start index for search based on position of currentItem
            start = this.menubarItems.indexOf(currentItem) + 1;
            if (start === this.menubarItems.length) {
                start = 0;
            }
    
            // Check remaining slots in the menu
            index = this.getIndexFirstChars(start, char);
    
            // If not found in remaining slots, check from beginning
            if (index === -1) {
                index = this.getIndexFirstChars(0, char);
            }
    
            // If match was found...
            if (index > -1) {
                this.setFocusToItem(this.menubarItems[index]);
            }
        };
    
        Menubar.prototype.getIndexFirstChars = function (startIndex, char) {
            for (var i = startIndex; i < this.firstChars.length; i++) {
                if (char === this.firstChars[i]) {
                    return i;
                }
            }
            return -1;
        };
    
        /*
        *   This content is licensed according to the W3C Software License at
        *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
        */
        var MenuItem = function (domNode, menuObj) {
    
            if (typeof popupObj !== 'object') {
                popupObj = false;
            }
    
            this.domNode = domNode;
            this.menu = menuObj;
            this.popupMenu = false;
            this.isMenubarItem = false;
            this.keyCode = Object.freeze({
                'TAB': 9,
                'RETURN': 13,
                'ESC': 27,
                'SPACE': 32,
                'PAGEUP': 33,
                'PAGEDOWN': 34,
                'END': 35,
                'HOME': 36,
                'LEFT': 37,
                'UP': 38,
                'RIGHT': 39,
                'DOWN': 40
            });
        };
    
        MenuItem.prototype.init = function () {
            this.domNode.tabIndex = -1;
            this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
            this.domNode.addEventListener('click', this.handleClick.bind(this));
            this.domNode.addEventListener('focus', this.handleFocus.bind(this));
            this.domNode.addEventListener('blur', this.handleBlur.bind(this));
            this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
            this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
    
            // Initialize flyout menu
            var nextElement = this.domNode.nextElementSibling;
            if (nextElement && nextElement.tagName === 'UL') {
                this.popupMenu = new PopupMenu(nextElement, this);
                this.popupMenu.init();
            }
        };
    
        MenuItem.prototype.isExpanded = function () {
            return this.domNode.getAttribute('aria-expanded') === 'true';
        };
    
        /* EVENT HANDLERS */
        MenuItem.prototype.handleKeydown = function (event) {
            var tgt = event.currentTarget,
                char = event.key,
                flag = false,
                clickEvent;
    
            function isPrintableCharacter(str) {
                return str.length === 1 && str.match(/\S/);
            }
    
            switch (event.keyCode) {
                case this.keyCode.SPACE:
                    event.preventDefault();
                    if(tgt.tagName === 'A'){
                        tgt = tgt;
                    } else if (tgt.tagName === 'BUTTON'){
                        tgt = this.domNode.childNodes[0];
                    }
                    // Create simulated mouse event to mimic the behavior of ATs
                    // and let the event handler handleClick do the housekeeping.
                    try {
                        clickEvent = new MouseEvent('click', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                    }
                    catch (err) {
                        if (document.createEvent) {
                            // DOM Level 3 for IE 9+
                            clickEvent = document.createEvent('MouseEvents');
                            clickEvent.initEvent('click', true, true);
                        }
                    }
                    tgt.dispatchEvent(clickEvent);
    
                    flag = true;
                    break;

                case this.keyCode.RETURN:
                    if (this.popupMenu) {
                        this.popupMenu.open();
                        this.popupMenu.setFocusToFirstItem();
                        flag = true;
                    }
                    break;

                    case this.keyCode.UP:
                    this.menu.setFocusToPreviousItem(this);
                    flag = true;
                    break;
    
                case this.keyCode.DOWN:
                    this.menu.setFocusToNextItem(this);
                    flag = true;
                    break;
    
                case this.keyCode.LEFT:
                    break;
    
                case this.keyCode.RIGHT:
                    break;
    
                case this.keyCode.HOME:
                case this.keyCode.PAGEUP:
                    this.menu.setFocusToFirstItem();
                    flag = true;
                    break;
    
                case this.keyCode.END:
                case this.keyCode.PAGEDOWN:
                    this.menu.setFocusToLastItem();
                    flag = true;
                    break;
    
                case this.keyCode.ESC:
                    this.menu.setFocusToController();
                    this.menu.close(true);
                    flag = true;
                    break;
    
                case this.keyCode.TAB:
                    this.menu.setFocusToController();
                    break;
    
                default:
                    if (isPrintableCharacter(char)) {
                        this.menu.setFocusByFirstCharacter(this, char);
                        flag = true;
                    }
                    break;
            }
    
            if (flag) {
                event.stopPropagation();
                event.preventDefault();
            }
        };
    
        MenuItem.prototype.setExpanded = function (value) {
            if (value) {
                this.domNode.setAttribute('aria-expanded', 'true');
            }
            else {
                this.domNode.setAttribute('aria-expanded', 'false');
            }
        };
    
        MenuItem.prototype.handleClick = function (event) {
            this.menu.setFocusToController();
            this.menu.close(true);
        };
    
        MenuItem.prototype.handleFocus = function (event) {
            this.menu.hasFocus = true;
        };
    
        MenuItem.prototype.handleBlur = function (event) {
            this.menu.hasFocus = false;
            setTimeout(this.menu.close.bind(this.menu, false), 300);
        };
    
        MenuItem.prototype.handleMouseover = function (event) {
            this.menu.hasHover = true;
            this.menu.open();
            if (this.popupMenu) {
                this.popupMenu.hasHover = true;
                this.popupMenu.open();
            }
        };
    
        MenuItem.prototype.handleMouseout = function (event) {
            if (this.popupMenu) {
                this.popupMenu.hasHover = false;
                this.popupMenu.close(true);
            }
    
            this.menu.hasHover = false;
            setTimeout(this.menu.close.bind(this.menu, false), 300);
        };
    
        /*
        *   This content is licensed according to the W3C Software License at
        *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
        */
        var PopupMenu = function (domNode, controllerObj, menuStyle) {
            var elementChildren,
                msgPrefix = 'PopupMenu constructor argument domNode ';
    
            // Check whether domNode is a DOM element
            if (!(domNode instanceof Element)) {
                throw new TypeError(msgPrefix + 'is not a DOM Element.');
            }
            // Check whether domNode has child elements
            if (domNode.childElementCount === 0) {
                throw new Error(msgPrefix + 'has no element children.');
            }
            // Check whether domNode descendant elements have A elements
            var childElement = domNode.firstElementChild;
            while (childElement) {
                var menuitem = childElement.firstElementChild;
                if (menuitem && menuitem === 'A') {
                    throw new Error(msgPrefix + 'has descendant elements that are not A elements.');
                }
                childElement = childElement.nextElementSibling;
            }
    
            this.isMenubar = false;
            this.domNode = domNode;
            this.menuStyle = menuStyle;
            this.controller = controllerObj;
            this.menuitems = []; // See PopupMenu init method
            this.firstChars = []; // See PopupMenu init method
            this.firstItem = null; // See PopupMenu init method
            this.lastItem = null; // See PopupMenu init method
            this.hasFocus = false; // See MenuItem handleFocus, handleBlur
            this.hasHover = false; // See PopupMenu handleMouseover, handleMouseout
        };
    
        /*
        *   @method PopupMenu.prototype.init
        *
        *   @desc
        *       Add domNode event listeners for mouseover and mouseout. Traverse
        *       domNode children to configure each menuitem and populate menuitems
        *       array. Initialize firstItem and lastItem properties.
        */
        PopupMenu.prototype.init = function () {
            var childElement, menuElement, menuItem, textContent, numItems, label;
            // Configure the domNode itself
            this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
            this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
    
            // Traverse the element children of domNode: configure each with
            // menuitem role behavior and store reference in menuitems array.
            childElement = this.domNode.firstElementChild;
            while (childElement) {
                menuElement = childElement.firstElementChild;
                if (menuElement && menuElement.tagName === 'A') {
                    menuItem = new MenuItem(menuElement, this);
                    menuItem.init();
                    this.menuitems.push(menuItem);
                    textContent = menuElement.textContent.trim();
                    this.firstChars.push(textContent.substring(0, 1).toLowerCase());
                }
                childElement = childElement.nextElementSibling;
            }
            // Use populated menuitems array to initialize firstItem and lastItem.
            numItems = this.menuitems.length;
            if (numItems > 0) {
                this.firstItem = this.menuitems[0];
                this.lastItem = this.menuitems[numItems - 1];
            }
        };
    
        /* EVENT HANDLERS */
    
        PopupMenu.prototype.handleMouseover = function (event) {
            this.hasHover = true;
        };
    
        PopupMenu.prototype.handleMouseout = function (event) {
            this.hasHover = false;
            setTimeout(this.close.bind(this, false), 1);
        };
    
        /* FOCUS MANAGEMENT METHODS */
    
        PopupMenu.prototype.setFocusToController = function (command, flag) {
            if (typeof command !== 'string') {
                command = '';
            }
    
            function setFocusToMenubarItem(controller, close) {
                while (controller) {
                    if (controller.isMenubarItem) {
                        controller.domNode.focus();
                        return controller;
                    }
                    else {
                        if (close) {
                            controller.menu.close(true);
                        }
                        controller.hasFocus = false;
                    }
                    controller = controller.menu.controller;
                }
                return false;
            }
    
            if (command === '') {
                if (this.controller && this.controller.domNode) {
                    this.controller.domNode.focus();
                    $(this.controller.domNode).children('a').first().focus();
                }
                return;
            }
    
            if (!this.controller.isMenubarItem) {
                this.controller.domNode.focus();
                this.close();
    
                if (command === 'next') {
                    var menubarItem = setFocusToMenubarItem(this.controller, false);
                    if (menubarItem) {
                        menubarItem.menu.setFocusToNextItem(menubarItem, flag);
                    }
                }
            }
            else {
                if (command === 'previous') {
                    this.controller.menu.setFocusToPreviousItem(this.controller, flag);
                }
                else if (command === 'next') {
                    this.controller.menu.setFocusToNextItem(this.controller, flag);
                }
            }
    
        };
    
        PopupMenu.prototype.setFocusToFirstItem = function () {
            this.firstItem.domNode.focus();
        };
    
        PopupMenu.prototype.setFocusToLastItem = function () {
            this.lastItem.domNode.focus();
        };
    
        PopupMenu.prototype.setFocusToPreviousItem = function (currentItem) {
            var index;
            if (currentItem === this.firstItem) {
                this.lastItem.domNode.focus();
            }
            else {
                index = this.menuitems.indexOf(currentItem);
                this.menuitems[index - 1].domNode.focus();
            }
        };
    
        PopupMenu.prototype.setFocusToNextItem = function (currentItem) {
            var index;
            if (currentItem === this.lastItem) {
                this.firstItem.domNode.focus();
            }
            else {
                index = this.menuitems.indexOf(currentItem);
                this.menuitems[index + 1].domNode.focus();
            }
        };
    
        PopupMenu.prototype.setFocusByFirstCharacter = function (currentItem, char) {
            var start, index = char.toLowerCase();
            char = char.toLowerCase();
            // Get start index for search based on position of currentItem
            start = this.menuitems.indexOf(currentItem) + 1;
            if (start === this.menuitems.length) {
                start = 0;
            }
            // Check remaining slots in the menu
            index = this.getIndexFirstChars(start, char);
            // If not found in remaining slots, check from beginning
            if (index === -1) {
                index = this.getIndexFirstChars(0, char);
            }
            // If match was found...
            if (index > -1) {
                this.menuitems[index].domNode.focus();
            }
        };
    
        PopupMenu.prototype.getIndexFirstChars = function (startIndex, char) {
            for (var i = startIndex; i < this.firstChars.length; i++) {
                if (char === this.firstChars[i]) {
                    return i;
                }
            }
            return -1;
        };
    
        /* MENU DISPLAY METHODS */
    
        PopupMenu.prototype.open = function () {
            // Set CSS properties
            this.domNode.style.display = 'inline-block';
            this.domNode.setAttribute('aria-hidden', 'false');
            this.controller.setExpanded(true);
    
        };
    
        PopupMenu.prototype.close = function (force) {
            var controllerHasHover = this.controller.hasHover;
            var hasFocus = this.hasFocus;
    
            for (var i = 0; i < this.menuitems.length; i++) {
                var mi = this.menuitems[i];
                if (mi.popupMenu) {
                    hasFocus = hasFocus | mi.popupMenu.hasFocus;
                }
            }
    
            if (!this.controller.isMenubarItem) {
                controllerHasHover = false;
            }
    
            if (force || (!hasFocus && !this.hasHover && !controllerHasHover)) {
                this.domNode.style.display = 'none';
                this.domNode.setAttribute('aria-hidden', 'true');
                this.controller.domNode.setAttribute('aria-expanded', 'false');
            }
        };
        menubarMain = new Menubar(navMenuMain, 'horizontal');
        menubarSecondary = new Menubar(navMenuSecondary, 'vertical');
        menubarMain.init();
        menubarSecondary.init();
    }
};