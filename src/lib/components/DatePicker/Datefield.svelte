<script>
    import { createEventDispatcher } from "svelte";
    import { isDate, parse, format as tostring, isSameDay } from "./lib/date";

    import {Icon} from "@smui/button";
    import { Svg } from '@smui/common';
    import Textfield from "@smui/textfield";
    import Popover from "./Popover.svelte";
    import Datepicker from "./Datepicker.svelte";

    const FORMAT_DEFAULT = "YYYY-MM-DD";

    export let icon = false;
    export let value = ""; // [Date, String]
    export let locale;
    export let readonly;
    export let disabled = null;
    export let format = FORMAT_DEFAULT;
    export let isAllowed = () => true;
    export let textfieldStyle = undefined;

    const dispatch = createEventDispatcher();

    let attrs = {};

    let elm;
    let visible = false;
    let pickerVal; // Date type, can be isNaN(pickerVal)
    let text = isDate(value) ? tostring(value, format) : value;
    let error = "";
    let originalValue = clone(value);

    $: {
        /* eslint-disable no-unused-vars */
        const { icon, value, type, locale, format, isAllowed, ...other } = $$props;
        attrs = other;
    }
    // the format must exist
    $: format = format || FORMAT_DEFAULT;

    $: validate(text);
    $: reformat(format);

    let inputActive = false;

    function validate() {
        error = "";
        if (text.length >= format.length) {
            let d = parse(text, format);
            if (isDate(d) && !isNaN(d)) {
                return;
            }
        }
        if (text.length > 0) {
            error = format;
        }
    }

    function reformat() {
        if (isDate(value) && !isNaN(value)) {
            text = tostring(value, format);
            return;
        } else {
            validate();
        }
    }

    function open() {
        if (visible) return;
        pickerVal = parse(text, format);
        visible = true;
    }

    function onselect({ detail }) {
        text = tostring(detail, format);
        value = typeof value === "string" ? text : clone(detail);
        visible = false;
        setval(text);
        focusInputElm();
    }

    function onfocus(e) {
        inputActive = true;
        readonly && open();
        dispatch("focus", e);
    }

    function onblur(e) {
        inputActive = false;
        setTimeout(() => {
            let dateField = e.target.parentNode.parentNode;
            if (dateField.contains(document.activeElement)) {
                return;
            }
            setval(text);
            dispatch("blur", e);
        }, 0);
    }

    function onkeydown(e) {
        if (/*e.keyCode === 13 || */ e.keyCode === 32) {
            e.stopPropagation();
            e.preventDefault();
            open();
        }
    }

    function focusInputElm() {
        if (readonly) return;
        let inputs = elm.querySelectorAll("input");
        inputs[0] && inputs[0].focus();
    }

    function setval(val) {
        if (typeof value === "string") {
            value = isDate(val) ? tostring(val, format) : val;
        } else {
            value = isDate(val) ? clone(val) : parse(val, format);
        }

        if (!isEqual(value, originalValue)) {
            originalValue = clone(value);
            dispatch("date-change", value);
        }
    }

    function clone(val) {
        if (isDate(val)) {
            return isNaN(val) ? new Date(NaN) : new Date(val.getTime());
        }
        return val;
    }

    function isEqual(v1, v2) {
        if (isDate(v1) && isDate(v2)) {
            return isSameDay(v1, v2);
        }
        return v1 === v2;
    }
</script>

<div class="date-field" class:focus-visible={visible || inputActive} disabled={disabled || null} bind:this={elm}>

    <Textfield
            bind:value={text} variant="outlined"
            placeholder={visible ? attrs.message || "date" : ""}
            {error}
            {...attrs}
            message={attrs.message}
            on:keydown={onkeydown}
            on:focus={onfocus}
            on:blur={onblur}
            style={`padding-right: 30px; ${textfieldStyle}; width: 100%`}
    />

    <Icon class="datefield-icon" style="position: absolute; right: 4px; top: 5px; width: 28px; outline: none;"
          component={Svg} viewBox="0 0 32 32" on:click={open}>
        <path fill="#444444" d="M 9 4 L 9 5 L 5 5 L 5 27 L 27 27 L 27 5 L 23 5 L 23 4 L 21 4 L 21 5 L 11 5 L 11 4 Z M 7 7 L 9 7 L 9 8 L 11 8 L 11 7 L 21 7 L 21 8 L 23 8 L 23 7 L 25 7 L 25 9 L 7 9 Z M 7 11 L 25 11 L 25 25 L 7 25 Z M 13 13 L 13 15 L 15 15 L 15 13 Z M 17 13 L 17 15 L 19 15 L 19 13 Z M 21 13 L 21 15 L 23 15 L 23 13 Z M 16 16 L 16 20 L 20 20 L 20 16 Z M 9 17 L 9 19 L 11 19 L 11 17 Z M 13 17 L 13 19 L 15 19 L 15 17 Z M 21 17 L 21 19 L 23 19 L 23 17 Z M 9 21 L 9 23 L 11 23 L 11 21 Z M 13 21 L 13 23 L 15 23 L 15 21 Z M 17 21 L 17 23 L 19 23 L 19 21 Z"/>
    </Icon>



    <Popover dx="0" dy="0" style="border-radius: 4px;" bind:visible on:close={focusInputElm}>
        <Datepicker {locale} {isAllowed} value={pickerVal} on:select={onselect} />
    </Popover>
</div>

<style>
    .date-field {
        position: relative;
        display: flex;
        align-items: center;
    }

    .datefield-icon {
        width: 32px;
        height: 32px;
        outline: none;;
    }

    .datefield-icon:hover {
        background-color: #a2fefe;
    }

    .datefield-icon:focus {
        outline: none !important;
        border: none;
    }

    .date-field .datefield-icon:active {
        outline: none;
        border: none;
    }

    :global(.date-field) > .icon {
        margin-right: 12px;
        color: #777;
        color: var(--bg-app-bar, #777);
    }
    :global(.date-field) > .icon:hover {
        cursor: pointer;
    }
    :global(.date-field).focus-visible > .icon,
    :global(.date-field).focus-visible .label {
        color: #1976d2;
        color: var(--primary, #1976d2);
    }
    :global(.date-field).focus-visible .focus-line {
        transform: scaleX(1);
        opacity: 1;
    }
</style>