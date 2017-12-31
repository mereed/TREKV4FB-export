function mySettings(props) {
  return (
    <Page>
      <Section title={<Text bold align="center">TREKv4FB</Text>}> </Section>
          <Section title={<Text align="center">Weather</Text>}>
              <Select
                label={`Weather Update Interval`}
                settingsKey="weatherInterval"
                options={[
                  {name:"Every 15 min", value:15},
                  {name:"Every 30 min", value:30},
                  {name:"Every hour", value:60},
                  {name:"Every 2 hourS", value:120}
                ]}
              />
         
              <Select
                label={`Temperature Format`}
                settingsKey="weatherTemperature"
                options={[
                  {name:"Celsius", value:"C"},
                  {name:"Fahrenheit", value:"F"}
                ]}
              /> 
            </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
        