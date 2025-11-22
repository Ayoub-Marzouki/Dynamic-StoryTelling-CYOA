<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="no"/>

  <xsl:template match="/">
    <data>
      <xsl:for-each select="//title">
        <title><xsl:value-of select="."/></title>
      </xsl:for-each>
      <nodes>
        <xsl:for-each select="//nodes/node">
          <node id="{@id}">
            <text><xsl:value-of select="text"/></text>
            <image><xsl:value-of select="image"/></image>
            <choices>
              <xsl:for-each select="choices/choice">
                <choice target="{@target}"><xsl:value-of select="."/></choice>
              </xsl:for-each>
            </choices>
          </node>
        </xsl:for-each>
      </nodes>
    </data>
  </xsl:template>
  
  <xsl:template match="text()"/>
</xsl:stylesheet>
