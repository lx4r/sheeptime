<template>
    <div class="row">
        <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Time format</h3>
                </div>
                <div class="panel-body">
                    <form>
                        <div class="radio">
                            <label>
                                <input type="radio" class="timeFormatRadio" name="timeFormatRadios" id="timeFormatEuropean" value="european">
                                DD.MM.YYYY, HH:MM
                            </label>
                        </div>
                        <div class="radio">
                            <label>
                                <input type="radio" class="timeFormatRadio" name="timeFormatRadios" id="timeFormatAmerican" value="american">
                                MM/DD/YYYY, HH:MM
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>